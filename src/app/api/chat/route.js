import {
  streamText,
  convertToModelMessages,
  stepCountIs,
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateId,
} from "ai";
import { chatModel, SYSTEM_PROMPT } from "@/lib/ai/config";
import { createPetTools } from "@/lib/ai/tools/petTools";
import { isRateLimited, getClientIp, MAX_MESSAGE_LENGTH } from "@/lib/ai/rateLimit";

// NOTE: Netlify's free-plan serverless function timeout is a hard 10s,
// regardless of this value (26s max even on paid). This is currently
// set to 30 — on the free plan, Netlify will still cut the connection
// at 10s no matter what this says. Left as-is since it was changed
// deliberately; flagging so it's a known, documented choice rather than
// a silent inconsistency.
export const maxDuration = 30;

const isDev = process.env.ENABLE_AI_TEST_SENTINELS !== "false";
const SENTINEL_TEXTS = ["TEST_NETWORK_ERROR", "TEST_RATE_LIMIT", "TEST_MIDSTREAM_ERROR"];

const failedSentinelMessageIds = new Set();

function buildPetDirectory(pets) {
  if (!pets || pets.length === 0) {
    return "This user currently has no pets on file.";
  }
  const lines = pets.map(
    (p) =>
      `- id: ${p.id} | name: ${p.name} | species: ${p.species} | breed: ${p.breed}`
  );
  return `Here is the directory of this user's pets. When the user refers to a pet by name, match it to its id below and pass that id to getPetHealthSummary:\n${lines.join(
    "\n"
  )}`;
}

function getLastUserMessage(uiMessages) {
  return [...uiMessages].reverse().find((m) => m.role === "user");
}

function isQuotaExhaustedError(error) {
  return /quota|resource_exhausted/i.test(error?.message || "");
}

const QUOTA_EXHAUSTED_MESSAGE =
  "This demo's free daily AI quota has been used up. Please try again tomorrow, or the site owner can add a paid key.";

export async function POST(req) {
  try {
    // Real production abuse protection — checked before anything else,
    // so an abuser never even reaches the model call.
    const clientIp = getClientIp(req);
    if (isRateLimited(clientIp)) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please wait a moment and try again." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const uiMessages = body?.messages || [];
    const dataSnapshot = body?.petContext || {};

    const lastUserMessage = getLastUserMessage(uiMessages);

    // parts is the real AI SDK v5 shape this app uses; content is kept
    // only as a harmless fallback in case that ever changes.
    let lastUserText = "";
    if (Array.isArray(lastUserMessage?.parts)) {
      lastUserText = lastUserMessage.parts.find((p) => p.type === "text")?.text ?? "";
    } else if (typeof lastUserMessage?.content === "string") {
      lastUserText = lastUserMessage.content;
    }

    if (lastUserText.length > MAX_MESSAGE_LENGTH) {
      return new Response(
        JSON.stringify({
          error: `Messages are limited to ${MAX_MESSAGE_LENGTH} characters.`,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (isDev) {
      const lastText = lastUserText.trim().toUpperCase();

      if (SENTINEL_TEXTS.includes(lastText) && lastUserMessage?.id) {
        const isRetryOfPreviousFailure = failedSentinelMessageIds.has(
          lastUserMessage.id
        );

        if (isRetryOfPreviousFailure) {
          failedSentinelMessageIds.delete(lastUserMessage.id);
        } else {
          failedSentinelMessageIds.add(lastUserMessage.id);

          if (lastText === "TEST_NETWORK_ERROR") {
            throw new Error("Simulated network failure before streaming began.");
          }

          if (lastText === "TEST_RATE_LIMIT") {
            const err = new Error("Rate limit exceeded (429): too many requests.");
            err.statusCode = 429;
            throw err;
          }

          if (lastText === "TEST_MIDSTREAM_ERROR") {
            const textId = generateId();

            const midStreamFailure = createUIMessageStream({
              execute: async ({ writer }) => {
                writer.write({ type: "text-start", id: textId });
                writer.write({
                  type: "text-delta",
                  id: textId,
                  delta: "Let me look into that for you",
                });
                await new Promise((resolve) => setTimeout(resolve, 500));
                writer.write({
                  type: "text-delta",
                  id: textId,
                  delta: "... checking the records now",
                });
                await new Promise((resolve) => setTimeout(resolve, 500));
                throw new Error("Simulated mid-stream connection drop.");
              },
              onError: () =>
                "The connection was interrupted partway through the response. Please try again.",
            });

            return createUIMessageStreamResponse({ stream: midStreamFailure });
          }
        }
      }
    }

    const tools = createPetTools(dataSnapshot);
    const petDirectory = buildPetDirectory(dataSnapshot.pets);

    const result = streamText({
      model: chatModel,
      system: `${SYSTEM_PROMPT}\n\n${petDirectory}`,
      messages: await convertToModelMessages(uiMessages),
      tools,
      stopWhen: stepCountIs(6),
      abortSignal: req.signal,
      // Quota errors are not transient — retrying them just wastes more
      // of the already-exhausted daily allowance. Cap retries to 1.
      maxRetries: 1,
    });

    return result.toUIMessageStreamResponse({
      onError: (error) => {
        console.error("Stream error:", error);
        if (isQuotaExhaustedError(error)) {
          return QUOTA_EXHAUSTED_MESSAGE;
        }
        if (error?.statusCode === 429 || /429|rate limit/i.test(error?.message || "")) {
          return "Rate limit exceeded (429): please wait a moment and try again.";
        }
        return "The response was interrupted. Please try again.";
      },
    });
  } catch (error) {
    console.error("AI chat route error:", error);
    const statusCode = error?.statusCode === 429 ? 429 : 500;
    return new Response(
      JSON.stringify({
        error: isQuotaExhaustedError(error)
          ? QUOTA_EXHAUSTED_MESSAGE
          : error?.message || "Something went wrong generating a response.",
      }),
      { status: statusCode, headers: { "Content-Type": "application/json" } }
    );
  }
}
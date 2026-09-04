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

// Netlify's real serverless function timeout is 10s on the free plan
// (26s max on paid) — this must stay at or under that, or long
// responses will 502 in production regardless of what this value says.
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
    const lastUserText =
      typeof lastUserMessage?.content === "string"
        ? lastUserMessage.content
        : lastUserMessage?.parts?.find((p) => p.type === "text")?.text ?? "";

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
    });

    return result.toUIMessageStreamResponse({
      onError: (error) => {
        console.error("Stream error:", error);
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
        error: error?.message || "Something went wrong generating a response.",
      }),
      { status: statusCode, headers: { "Content-Type": "application/json" } }
    );
  }
}
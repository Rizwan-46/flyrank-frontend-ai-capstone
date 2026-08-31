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

export const maxDuration = 30;

// Controls the dev-only sabotage sentinels (TEST_NETWORK_ERROR, etc.).
// Deliberately NOT tied to NODE_ENV — hosting platforms like Netlify
// always set NODE_ENV=production on deploy, which would silently
// disable this everywhere except local dev. Defaults to enabled so
// these remain demoable on the live URL; set ENABLE_AI_TEST_SENTINELS=false
// in your host's environment variables to turn them off if ever needed.
const isDev = process.env.ENABLE_AI_TEST_SENTINELS !== "false";

const SENTINEL_TEXTS = ["TEST_NETWORK_ERROR", "TEST_RATE_LIMIT", "TEST_MIDSTREAM_ERROR"];

// In-memory, per-server-instance. Keyed by the actual message id (not
// just its text), so a FRESH send of a sentinel phrase always fails,
// and clicking "Try Again" — which resends that same message — always
// succeeds. Typing the same phrase again as a brand-new message always
// fails again too, since it gets a new id.
// Note: on serverless hosts (e.g. Netlify functions), a cold instance
// handling the retry could reset this — if retries behave inconsistently
// in production, this tracking may need to move client-side instead.
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
    const body = await req.json();
    const uiMessages = body?.messages || [];
    const dataSnapshot = body?.petContext || {};

    if (isDev) {
      const lastUserMessage = getLastUserMessage(uiMessages);
      const lastText = (
        lastUserMessage?.parts?.find((p) => p.type === "text")?.text ?? ""
      )
        .trim()
        .toUpperCase();

      if (SENTINEL_TEXTS.includes(lastText) && lastUserMessage?.id) {
        const isRetryOfPreviousFailure = failedSentinelMessageIds.has(
          lastUserMessage.id
        );

        if (isRetryOfPreviousFailure) {
          // This exact message already failed once — this is the retry.
          // Clear it and fall through to the normal path so it succeeds.
          failedSentinelMessageIds.delete(lastUserMessage.id);
        } else {
          // First time seeing this specific message — fail it.
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
      stopWhen: stepCountIs(4),
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
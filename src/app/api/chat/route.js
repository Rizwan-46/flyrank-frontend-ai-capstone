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

const isDev = process.env.NODE_ENV !== "production";

// Dev-only, in-memory, lives for the life of the dev server process.
// Lets each sentinel fail exactly once, then succeed on the next
// attempt — so retry can actually be demonstrated recovering.
const sentinelAttempts = new Map();

function shouldFailSentinel(key) {
  const alreadyFailedOnce = sentinelAttempts.get(key);
  if (!alreadyFailedOnce) {
    sentinelAttempts.set(key, true);
    return true;
  }
  sentinelAttempts.delete(key);
  return false;
}

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

function getLastUserText(uiMessages) {
  const lastUser = [...uiMessages].reverse().find((m) => m.role === "user");
  return lastUser?.parts?.find((p) => p.type === "text")?.text?.trim() ?? "";
}

export async function POST(req) {
  try {
    const body = await req.json();
    const uiMessages = body?.messages || [];
    const dataSnapshot = body?.petContext || {};

    if (isDev) {
      const lastText = getLastUserText(uiMessages).toUpperCase();

      if (lastText === "TEST_NETWORK_ERROR" && shouldFailSentinel("network")) {
        throw new Error("Simulated network failure before streaming began.");
      }
      if (lastText === "TEST_RATE_LIMIT" && shouldFailSentinel("rate_limit")) {
        const err = new Error("Rate limit exceeded (429): too many requests.");
        err.statusCode = 429;
        throw err;
      }

      // Simulates a connection drop partway through a response: streams
      // some real text, then deliberately fails before finishing. Tests
      // that partial content stays visible and Retry recovers cleanly.
      if (lastText === "TEST_MIDSTREAM_ERROR" && shouldFailSentinel("midstream")) {
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
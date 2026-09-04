// @vitest-environment node
import { describe, it, expect, vi } from "vitest";
import { MockLanguageModelV4 } from "ai/test";
import { simulateReadableStream } from "ai";

// Replace the real AI config with a fake, instant, offline model.
// The real Google provider (and its API key) is never loaded or used
// by this test file at all.
vi.mock("@/lib/ai/config", () => ({
  chatModel: new MockLanguageModelV4({
    doStream: async () => ({
      stream: simulateReadableStream({
        chunks: [
          { type: "text-start", id: "t1" },
          { type: "text-delta", id: "t1", delta: "Mocked response, no real API was called." },
          { type: "text-end", id: "t1" },
          {
            type: "finish",
            finishReason: "stop",
            usage: { inputTokens: 5, outputTokens: 5, totalTokens: 10 },
          },
        ],
      }),
    }),
  }),
  SYSTEM_PROMPT: "You are a test assistant.",
}));

const { POST } = await import("@/app/api/chat/route");

function makeRequest(userText) {
  const body = {
    messages: [
      {
        id: "msg-1",
        role: "user",
        parts: [{ type: "text", text: userText }],
      },
    ],
    petContext: { pets: [] },
  };

  return new Request("http://localhost/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("chat API route", () => {
  it("responds using the mocked model, never the real AI provider", async () => {
    const response = await POST(makeRequest("Hello"));
    expect(response.status).toBe(200);

    const text = await response.text();
    expect(text).toContain("Mocked response, no real API was called.");
  });

  it("handles a request with an empty pet list without error", async () => {
    const response = await POST(makeRequest("What are my pets?"));
    expect(response.status).toBe(200);
  });
});
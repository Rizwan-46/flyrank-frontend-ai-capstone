import { streamText } from "ai";
import { chatModel, SYSTEM_PROMPT } from "@/lib/ai/config";

export const maxDuration = 30;

export async function POST(req) {
  try {
    const body = await req.json();
    const rawMessages = body?.messages || [];
    
    // Safely extract the text from the frontend's "parts" array
    const coreMessages = rawMessages.map((msg) => {
      let textContent = "";
      
      if (msg.parts && Array.isArray(msg.parts)) {
        textContent = msg.parts.map(p => p.text || "").join("");
      } else if (msg.content) {
        textContent = msg.content;
      }

      return {
        role: msg.role,
        content: textContent,
      };
    });

    const result = streamText({
      model: chatModel,
      system: SYSTEM_PROMPT,
      messages: coreMessages,
      abortSignal: req.signal, 
    });

    // RESTORED: The correct SDK v5 method from Claude's original code
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("AI chat route error:", error);
    return new Response(
      JSON.stringify({ error: "Something went wrong generating a response." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
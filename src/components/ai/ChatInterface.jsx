"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ThinkingIndicator from "./ThinkingIndicator";
import JumpToLatest from "./JumpToLatest";
import ChatEmptyState from "./ChatEmptyState";

const SCROLL_THRESHOLD_PX = 80;

export default function ChatInterface() {
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const [input, setInput] = useState("");
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [showJumpToLatest, setShowJumpToLatest] = useState(false);
  const scrollRef = useRef(null);
  const bottomRef = useRef(null);

  const isGenerating = status === "submitted" || status === "streaming";
  const showThinking = status === "submitted";

  function scrollToBottom(behavior = "smooth") {
    bottomRef.current?.scrollIntoView({ behavior, block: "end" });
    setShowJumpToLatest(false);
    setIsNearBottom(true);
  }

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const nearBottom = distanceFromBottom < SCROLL_THRESHOLD_PX;
    setIsNearBottom(nearBottom);
    if (nearBottom) setShowJumpToLatest(false);
  }

  useEffect(() => {
    if (isNearBottom) {
      scrollToBottom("auto");
    } else if (messages.length > 0) {
      setShowJumpToLatest(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, status]);

  function handleSend(text) {
    const trimmed = text.trim();
    if (!trimmed || isGenerating) return;
    sendMessage({ text: trimmed });
    setInput("");
    scrollToBottom("smooth");
  }

  function handleFormSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    handleSend(input);
  }

  return (
    <div className="relative flex h-[calc(100dvh-9rem)] min-h-[420px] flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-sm">
      {/* Scrollable Chat Area */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto bg-muted/20 px-4 py-6 sm:px-6 md:py-8"
      >
        {messages.length === 0 ? (
          <ChatEmptyState onExampleClick={handleSend} />
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {showThinking && <ThinkingIndicator />}
            <div ref={bottomRef} className="h-2" />
          </div>
        )}
      </div>

      {showJumpToLatest && <JumpToLatest onClick={() => scrollToBottom("smooth")} />}

      {/* Input Area */}
      <div className="bg-background px-4 py-4 sm:px-6 md:py-5 border-t border-border/50">
        <div className="mx-auto max-w-3xl">
          <ChatInput
            value={input}
            onChange={(e) => setInput(e.target.value)} 
            onSubmit={handleFormSubmit}
            onStop={stop}
            isGenerating={isGenerating}
          />
          <p className="mt-2.5 text-center text-xs text-muted-foreground">
            AI can make mistakes. Always consult your vet for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
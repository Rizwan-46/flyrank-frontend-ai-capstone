"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useAuthStore } from "@/store/authStore";
import { usePetStore } from "@/store/petStore";
import { useVaccinationStore } from "@/store/vaccinationStore";
import { useMedicalRecordStore } from "@/store/medicalRecordStore";
import { useAppointmentStore } from "@/store/appointmentStore";
import { useChatStore } from "@/store/chatStore";
import { buildPetContext } from "@/lib/ai/buildPetContext";
import dynamic from "next/dynamic";
import ChatInput from "./ChatInput";

// Lazy-load the heavy message component only when messages actually exist
const ChatMessage = dynamic(() => import("./ChatMessage"), { 
  ssr: false 
});
import ThinkingIndicator from "./ThinkingIndicator";
import JumpToLatest from "./JumpToLatest";
import ChatEmptyState from "./ChatEmptyState";
import ChatErrorBanner from "./ChatErrorBanner";

const SCROLL_THRESHOLD_PX = 80;
const EMPTY_ARRAY = [];

export default function ChatInterface() {
  const { messages, sendMessage, status, stop, setMessages, error, regenerate } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const currentUser = useAuthStore((s) => s.currentUser);
  const pets = usePetStore((s) => s.pets);
  const vaccinations = useVaccinationStore((s) => s.vaccinations);
  const medicalRecords = useMedicalRecordStore((s) => s.medicalRecords);
  const appointments = useAppointmentStore((s) => s.appointments);

  const chatHasHydrated = useChatStore((s) => s.hasHydrated);
  const setStoredMessages = useChatStore((s) => s.setMessages);
  const storedMessages = useChatStore(
    (s) => s.messagesByUser[currentUser?.id] || EMPTY_ARRAY
  );

  const petsById = useMemo(() => {
    const own = pets.filter((p) => p.userId === currentUser?.id);
    return Object.fromEntries(own.map((p) => [p.id, p.name]));
  }, [pets, currentUser?.id]);

  const [input, setInput] = useState("");
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [showJumpToLatest, setShowJumpToLatest] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [stalled, setStalled] = useState(false);
  const stallTimeoutRef = useRef(null);
  const scrollRef = useRef(null);
  const bottomRef = useRef(null);
  const restoredForUserRef = useRef(null);
  const isSendingRef = useRef(false);

  const isGenerating = status === "submitted" || status === "streaming";
  const showThinking = status === "submitted";

  useEffect(() => {
    if (!chatHasHydrated || !currentUser) return;
    if (restoredForUserRef.current === currentUser.id) return;

    setMessages(storedMessages.length > 0 ? storedMessages : []);
    restoredForUserRef.current = currentUser.id;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatHasHydrated, currentUser?.id]);

  useEffect(() => {
    if (!chatHasHydrated || !currentUser) return;
    if (restoredForUserRef.current !== currentUser.id) return;
    setStoredMessages(currentUser.id, messages);
  }, [messages, chatHasHydrated, currentUser, setStoredMessages]);

  useEffect(() => {
    if (status === "ready" || status === "error") {
      isSendingRef.current = false;
    }
  }, [status]);

  useEffect(() => {
    clearTimeout(stallTimeoutRef.current);
    if (!isGenerating) {
      setStalled(false);
      return;
    }
    stallTimeoutRef.current = setTimeout(() => setStalled(true), 12000);
    return () => clearTimeout(stallTimeoutRef.current);
  }, [isGenerating, messages]);

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
    if (!trimmed || isGenerating || isSendingRef.current) return;
    isSendingRef.current = true;

    const petContext = buildPetContext({
      currentUser,
      pets,
      vaccinations,
      medicalRecords,
      appointments,
    });

    sendMessage({ text: trimmed }, { body: { petContext } });
    setInput("");
    scrollToBottom("smooth");
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    handleSend(input);
  }

  async function handleRetry() {
    if (isRetrying || isGenerating) return;
    setIsRetrying(true);
    try {
      if (typeof regenerate === "function") {
        await regenerate();
      } else {
        const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
        const lastUserText = lastUserMessage?.parts?.find((p) => p.type === "text")?.text;
        if (lastUserText) {
          handleSend(lastUserText);
        }
      }
    } catch (err) {
      console.error("Retry failed:", err);
    } finally {
      setIsRetrying(false);
    }
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm animate-in fade-in zoom-in-[0.99] duration-500">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-60" />

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="relative z-10 flex-1 overflow-y-auto px-2 py-6 sm:px-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {messages.length === 0 ? (
          <ChatEmptyState onExampleClick={handleSend} />
        ) : (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
            {messages.map((message, index) => {
              const previousUserText =
                message.role === "assistant"
                  ? messages[index - 1]?.parts?.find((p) => p.type === "text")?.text
                  : undefined;

              return (
                <ChatMessage
                  key={message.id}
                  message={message}
                  petsById={petsById}
                  onRetry={
                    previousUserText ? () => handleSend(previousUserText) : undefined
                  }
                />
              );
            })}
            {showThinking && <ThinkingIndicator />}
            {error && (
              <ChatErrorBanner
                error={error}
                onRetry={handleRetry}
                disabled={isRetrying || isGenerating}
              />
            )}
            <div ref={bottomRef} className="h-4" />
          </div>
        )}
      </div>

      {showJumpToLatest && <JumpToLatest onClick={() => scrollToBottom("smooth")} />}

      {/* Enhanced smooth fade overlay for text flowing behind the input */}
      <div className="pointer-events-none absolute bottom-[68px] z-20 h-16 w-full bg-gradient-to-t from-card via-card/80 to-transparent sm:bottom-[76px]" />

      <div className="relative z-30 mx-auto w-full max-w-3xl shrink-0 bg-card px-2 pb-2 pt-1 sm:px-4">
        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={handleFormSubmit}
          onStop={stop}
          isGenerating={isGenerating}
          error={error}
        />
      </div>
    </div>
  );
}
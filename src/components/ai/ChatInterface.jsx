"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useAuthStore } from "@/store/authStore";
import { usePetStore } from "@/store/petStore";
import { useVaccinationStore } from "@/store/vaccinationStore";
import { useMedicalRecordStore } from "@/store/medicalRecordStore";
import { useAppointmentStore } from "@/store/appointmentStore";
import { buildPetContext } from "@/lib/ai/buildPetContext";
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

  const currentUser = useAuthStore((s) => s.currentUser);
  const pets = usePetStore((s) => s.pets);
  const vaccinations = useVaccinationStore((s) => s.vaccinations);
  const medicalRecords = useMedicalRecordStore((s) => s.medicalRecords);
  const appointments = useAppointmentStore((s) => s.appointments);

  const petsById = useMemo(() => {
    const own = pets.filter((p) => p.userId === currentUser?.id);
    return Object.fromEntries(own.map((p) => [p.id, p.name]));
  }, [pets, currentUser?.id]);

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

  // ChatInput submits via a form event now, not raw text — this bridges
  // that back to handleSend, which still works fine for the empty-state
  // example prompts (those call handleSend directly with a string).
  function handleFormSubmit(e) {
    e.preventDefault();
    handleSend(input);
  }

  return (
    <div className="relative flex h-[calc(100dvh-9rem)] min-h-[420px] flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-6 sm:px-6"
      >
        {messages.length === 0 ? (
          <ChatEmptyState onExampleClick={handleSend} />
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
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
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {showJumpToLatest && <JumpToLatest onClick={() => scrollToBottom("smooth")} />}

      <div className="border-t border-border p-3 sm:p-4">
        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={handleFormSubmit}
          onStop={stop}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
}
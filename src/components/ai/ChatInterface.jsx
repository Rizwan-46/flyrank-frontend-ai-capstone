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
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
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
  const scrollRef = useRef(null);
  const bottomRef = useRef(null);
  const restoredForUserRef = useRef(null);

  const [viewportHeight, setViewportHeight] = useState(null);

  // iOS Safari's dvh doesn't reliably shrink when the on-screen keyboard
  // opens. window.visualViewport does report the correct keyboard-adjusted
  // height, so we use it to actively resize the chat container — keeping
  // the input visible above the keyboard instead of hidden behind it.
  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;

    function updateHeight() {
      setViewportHeight(window.visualViewport.height);
    }

    updateHeight();
    window.visualViewport.addEventListener("resize", updateHeight);
    window.visualViewport.addEventListener("scroll", updateHeight);

    return () => {
      window.visualViewport.removeEventListener("resize", updateHeight);
      window.visualViewport.removeEventListener("scroll", updateHeight);
    };
  }, []);

  const isGenerating = status === "submitted" || status === "streaming";
  const showThinking = status === "submitted";

  // Restore this user's saved conversation once localStorage has
  // hydrated. Re-runs if the logged-in user changes mid-session.
  useEffect(() => {
    if (!chatHasHydrated || !currentUser) return;
    if (restoredForUserRef.current === currentUser.id) return;

    setMessages(storedMessages.length > 0 ? storedMessages : []);
    restoredForUserRef.current = currentUser.id;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatHasHydrated, currentUser?.id]);

  // Persist every change so navigating to another dashboard page and
  // back — or refreshing the browser — doesn't lose the conversation.
  useEffect(() => {
    if (!chatHasHydrated || !currentUser) return;
    if (restoredForUserRef.current !== currentUser.id) return;
    setStoredMessages(currentUser.id, messages);
  }, [messages, chatHasHydrated, currentUser, setStoredMessages]);

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
        // Fallback if this SDK version doesn't expose regenerate(): just
        // resend the last user message instead of failing silently.
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
    <div
      className="relative flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-border bg-card"
      style={{
        height: viewportHeight
          ? `${Math.max(viewportHeight - 144, 420)}px`
          : "calc(100dvh - 9rem)",
      }}
    >
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
            {error && (
              <ChatErrorBanner
                error={error}
                onRetry={handleRetry}
                disabled={isRetrying || isGenerating}
              />
            )}
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
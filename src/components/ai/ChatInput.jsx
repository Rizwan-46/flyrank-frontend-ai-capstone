"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Square, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Face } from "@/components/ui/motion-primitives";

export default function ChatInput({
  value = "",
  onChange,
  onSubmit,
  onStop,
  isGenerating,
  error,
}) {
  const [sendPhase, setSendPhase] = useState("idle");
  const wasGeneratingRef = useRef(isGenerating);

  useEffect(() => {
    const justFinished = wasGeneratingRef.current && !isGenerating;
    wasGeneratingRef.current = isGenerating;

    if (!justFinished) return;

    if (error) {
      setSendPhase("error");
    } else {
      setSendPhase("success");
      const timeout = setTimeout(() => setSendPhase("idle"), 900);
      return () => clearTimeout(timeout);
    }
  }, [isGenerating, error]);

  function handleChange(e) {
    if (sendPhase !== "idle") setSendPhase("idle");
    onChange(e.target.value.slice(0, 2000));
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    onSubmit(e);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  }

  const safeValue = value || "";
  const canSend = safeValue.trim().length > 0 && !isGenerating && sendPhase !== "success";

  return (
    <div className="flex w-full flex-col items-center gap-2.5">
      <form
        onSubmit={handleFormSubmit}
        className="relative flex w-full items-end gap-2 rounded-3xl border border-border/60 bg-card/50 p-2 pl-3 shadow-sm backdrop-blur-md transition-all duration-300 focus-within:border-primary/40 focus-within:bg-card focus-within:shadow-md focus-within:ring-4 focus-within:ring-primary/10 hover:border-border"
      >
        <Textarea
          value={safeValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your pet's health..."
          rows={1}
          maxLength={2000}
          className="max-h-32 min-h-[44px] flex-1 resize-none border-0 bg-transparent px-2 py-3 text-sm placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:ring-offset-0"
          aria-label="Message"
        />

        <div className="relative mb-0.5 h-10 w-10 shrink-0">
          <Face visible={isGenerating} hiddenTransform="scale(0.8)" duration={180}>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={onStop}
              className="h-10 w-10 rounded-full bg-muted text-foreground shadow-sm hover:bg-muted/80"
            >
              <Square className="h-4 w-4 fill-current" />
              <span className="sr-only">Stop generating</span>
            </Button>
          </Face>

          <Face
            visible={!isGenerating && sendPhase === "success"}
            hiddenTransform="scale(0.75)"
            duration={250}
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-sm motion-safe:animate-pop-once dark:bg-emerald-500/20 dark:text-emerald-400"
              aria-live="polite"
            >
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Sent</span>
            </div>
          </Face>

          <Face
            visible={!isGenerating && sendPhase === "idle"}
            hiddenTransform="scale(0.8)"
            duration={180}
          >
            <Button
              type="submit"
              size="icon"
              disabled={!canSend}
              className="h-10 w-10 rounded-full bg-primary text-primary-foreground shadow-sm transition-transform active:scale-95 disabled:opacity-50"
            >
              <Send className="ml-0.5 h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </Face>

          <Face
            visible={!isGenerating && sendPhase === "error"}
            hiddenTransform="scale(0.8)"
            duration={180}
          >
            <Button
              type="submit"
              size="icon"
              disabled={!canSend}
              className="h-10 w-10 rounded-full bg-destructive text-destructive-foreground shadow-sm transition-transform hover:bg-destructive/90 active:scale-95 motion-safe:animate-shake-once"
            >
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Last message failed — send again</span>
            </Button>
          </Face>
        </div>
      </form>

      {/* AI Disclaimer — hidden on mobile to save space, shown as an
          inline row (icon + text) from sm up. */}
      <div className="hidden items-center gap-1.5 text-center text-[10px] font-medium text-muted-foreground opacity-75 sm:flex sm:text-xs">
        <ShieldAlert className="h-3 w-3" aria-hidden="true" />
        <p>
          AI can make mistakes. Always consult your vet for professional medical advice.
        </p>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Square, CheckCircle2, AlertTriangle } from "lucide-react";
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
  // Reflects the REAL outcome of the last send: as soon as generation
  // finishes, we look at whether an error is present. "success" briefly
  // pulses, then returns to idle on its own. "error" persists until the
  // user edits the input or sends again — same lifecycle language as
  // the standalone AsyncActionButton demo, but driven by this app's
  // actual chat status instead of a fake timer.
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
    onChange(e.target.value);
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
    <form
      onSubmit={handleFormSubmit}
      className="relative flex w-full items-end gap-2 rounded-3xl border border-border bg-card p-2 shadow-sm transition-shadow focus-within:ring-1 focus-within:ring-ring"
    >
      <Textarea
        value={safeValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Help from AI..."
        rows={1}
        className="max-h-32 min-h-[44px] flex-1 resize-none border-0 bg-transparent px-4 py-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
        aria-label="Message"
      />

      <div className="relative mb-0.5 h-9 w-9 shrink-0 pr-0.5">
        {/* Loading state = the real Stop button. It stays fully
            clickable — this control's job during generation is to
            interrupt, not just to display a spinner. */}
        <Face visible={isGenerating} hiddenTransform="scale(0.8)" duration={180}>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={onStop}
            className="h-9 w-9 rounded-full bg-muted text-foreground hover:bg-muted/80"
          >
            <Square className="h-4 w-4 fill-current" />
            <span className="sr-only">Stop generating</span>
          </Button>
        </Face>

        <Face visible={!isGenerating && sendPhase === "success"} hiddenTransform="scale(0.75)" duration={250}>
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 motion-safe:animate-pop-once"
            aria-live="polite"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
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
            className="h-9 w-9 rounded-full bg-primary text-primary-foreground transition-transform active:scale-95 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
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
            className="h-9 w-9 rounded-full bg-destructive/10 text-destructive transition-transform hover:bg-destructive/20 active:scale-95 motion-safe:animate-shake-once"
          >
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Last message failed — send again</span>
          </Button>
        </Face>
      </div>
    </form>
  );
}
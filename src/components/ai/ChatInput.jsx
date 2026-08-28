"use client";

import { Send, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ChatInput({ value = "", onChange, onSubmit, onStop, isGenerating }) {
  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  }

  const safeValue = value || "";
  const canSend = safeValue.trim().length > 0 && !isGenerating;

  return (
    <form
      onSubmit={onSubmit}
      className="relative flex w-full items-end gap-2 rounded-3xl border border-border bg-card p-2 shadow-sm focus-within:ring-1 focus-within:ring-ring transition-shadow"
    >
      <Textarea
        value={safeValue}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Help from AI..."
        rows={1}
        className="max-h-32 min-h-[44px] flex-1 resize-none border-0 bg-transparent px-4 py-3 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
        aria-label="Message"
      />
      <div className="mb-0.5 pr-0.5">
        {isGenerating ? (
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={onStop}
            className="h-9 w-9 rounded-full bg-muted hover:bg-muted/80 text-foreground"
          >
            <Square className="h-4 w-4 fill-current" />
            <span className="sr-only">Stop generating</span>
          </Button>
        ) : (
          <Button
            type="submit"
            size="icon"
            disabled={!canSend}
            className="h-9 w-9 rounded-full bg-primary text-primary-foreground transition-transform active:scale-95 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        )}
      </div>
    </form>
  );
}
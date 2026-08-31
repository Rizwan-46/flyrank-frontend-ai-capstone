"use client";

import { Loader2, CheckCircle2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAsyncButtonState } from "@/hooks/useAsyncButtonState";
import { Face, EASE_STANDARD, EASE_SUCCESS_POP } from "./motion-primitives";

export default function AsyncActionButton({
  idleLabel = "Send",
  idleIcon: IdleIcon,
  errorLabel = "Retry",
  successHoldMs = 900,
  onAction,
  className,
  widthClassName = "w-32",
}) {
  const { phase, attempt, run } = useAsyncButtonState({ successHoldMs });

  return (
    <button
      type="button"
      onClick={() => run(onAction)}
      aria-live="polite"
      aria-busy={phase === "loading"}
      disabled={phase === "loading" || phase === "success"}
      className={cn(
        "relative inline-flex h-10 items-center justify-center overflow-hidden rounded-lg text-sm font-medium",
        "transition-colors duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-default",
        phase === "error"
          ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
          : phase === "success"
          ? "bg-emerald-100 text-emerald-700"
          : "bg-primary text-primary-foreground hover:bg-primary/90",
        widthClassName,
        className
      )}
    >
      <Face visible={phase === "idle"} hiddenTransform="translateY(4px)">
        {IdleIcon && <IdleIcon className="h-4 w-4" aria-hidden="true" />}
        {idleLabel}
      </Face>

      <Face visible={phase === "loading"} hiddenTransform="translateY(-4px)">
        <Loader2
          className="h-4 w-4 animate-spin motion-reduce:animate-none motion-reduce:opacity-60"
          aria-hidden="true"
        />
        <span className="sr-only">Working…</span>
      </Face>

      <Face visible={phase === "success"} hiddenTransform="scale(0.75)" duration={250} ease={EASE_SUCCESS_POP}>
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Success</span>
      </Face>

      <Face visible={phase === "error"} hiddenTransform="translateY(4px)">
        <span key={attempt} className="flex items-center gap-1.5 motion-safe:animate-shake-once">
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          {errorLabel}
        </span>
      </Face>
    </button>
  );
}
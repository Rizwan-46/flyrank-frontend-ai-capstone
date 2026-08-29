import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categorizeChatError } from "@/lib/ai/errorMessages";

export default function ChatErrorBanner({ error, onRetry, disabled }) {
  if (!error) return null;
  const { title, description } = categorizeChatError(error);

  return (
    <div
      role="alert"
      className="group relative mx-auto flex w-full max-w-3xl items-center justify-between gap-4 overflow-hidden rounded-2xl border border-destructive/20 bg-gradient-to-r from-destructive/10 via-destructive/5 to-transparent p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-destructive/30 hover:shadow-md motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 dark:border-destructive/30 dark:from-destructive/20 dark:via-destructive/10"
    >
      {/* Subtle accent bar on the left */}
      <div className="absolute inset-y-0 left-0 w-1 bg-destructive/60 transition-colors group-hover:bg-destructive" />

      <div className="flex min-w-0 items-start gap-3 pl-1 sm:items-center">
        {/* Glowing Icon Badge */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-destructive/15 ring-1 ring-destructive/20 transition-transform duration-300 group-hover:scale-105">
          <AlertCircle className="h-4 w-4 text-destructive" aria-hidden="true" />
        </div>

        {/* Error Details */}
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold tracking-tight text-foreground">
            {title}
          </h4>
          <p className="text-xs text-muted-foreground sm:text-sm">
            {description}
          </p>
        </div>
      </div>

      {/* Action Button */}
      <Button
        size="sm"
        variant="outline"
        onClick={onRetry}
        disabled={disabled}
        className="shrink-0 gap-1.5 rounded-xl border-destructive/30 bg-background/80 px-3.5 py-2 text-xs font-medium text-destructive shadow-xs backdrop-blur-xs transition-all duration-200 hover:border-destructive hover:bg-destructive hover:text-destructive-foreground active:scale-95 disabled:pointer-events-none disabled:opacity-50"
      >
        <RefreshCw
          className={`h-3.5 w-3.5 transition-transform duration-500 ${
            disabled ? "animate-spin" : "group-hover:rotate-180"
          }`}
          aria-hidden="true"
        />
        <span>Try Again</span>
      </Button>
    </div>
  );
}
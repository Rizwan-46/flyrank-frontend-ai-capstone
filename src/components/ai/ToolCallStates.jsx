import { Search, ListChecks, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ToolInputStreaming() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-2 rounded-xl border border-dashed border-border bg-card px-3 py-2.5 text-sm text-muted-foreground motion-safe:animate-pulse"
    >
      <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
      Searching pet health information...
    </div>
  );
}

export function ToolInputAvailable({ petName }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200">
      <ListChecks className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
      <span>
        Health record lookup — <span className="font-medium">{petName || "pet"}</span>
      </span>
    </div>
  );
}

export function ToolOutputError({ errorText, onRetry }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200">
      <div className="flex items-start gap-2">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
        <div className="min-w-0">
          <p className="font-medium text-red-800">
            Unable to retrieve that pet&apos;s health information.
          </p>
          <p className="mt-0.5 text-red-700">
            {errorText || "The pet records could not be loaded right now."}
          </p>
        </div>
      </div>
      {onRetry && (
        <Button
          size="sm"
          variant="outline"
          onClick={onRetry}
          className="mt-3 gap-1.5 border-red-300 text-red-700 hover:bg-red-100 hover:text-red-800"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Try Again
        </Button>
      )}
    </div>
  );
}
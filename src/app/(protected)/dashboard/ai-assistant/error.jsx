"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AIAssistantError({ error, reset }) {
  useEffect(() => {
    console.error("AI Assistant page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100">
        <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Something went wrong loading the AI Assistant
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          You can try again, or head back to your dashboard.
        </p>
      </div>
      <div className="mt-2 flex gap-2">
        <Button onClick={reset}>Try Again</Button>
        <Button variant="outline" onClick={() => (window.location.href = "/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
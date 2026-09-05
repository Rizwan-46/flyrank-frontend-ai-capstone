"use client";

import { Info, ShieldAlert } from "lucide-react";

export default function AssistantContextTrigger({ petCount, onClick }) {
  const hasPets = petCount > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-fit shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:gap-1.5 sm:px-3 sm:py-1 sm:text-xs ${
        hasPets
          ? "border-border bg-background text-muted-foreground hover:bg-muted/50"
          : "border-amber-500/20 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400"
      }`}
    >
      {hasPets ? (
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
      ) : (
        <ShieldAlert className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
      )}
      <span className="whitespace-nowrap">
        {hasPets ? `${petCount} ${petCount === 1 ? "Pet" : "Pets"}` : "No pets"}
      </span>
      <Info
        className="hidden h-3 w-3 opacity-50 transition-opacity group-hover:opacity-100 sm:block"
        aria-hidden="true"
      />
    </button>
  );
}
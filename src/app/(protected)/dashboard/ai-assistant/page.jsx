"use client";

import { useMemo } from "react";
import { Sparkles, ShieldAlert, Bot } from "lucide-react";
import { usePetStore } from "@/store/petStore";
import { useAuthStore } from "@/store/authStore";
import ChatInterface from "@/components/ai/ChatInterface";
import { Badge } from "@/components/ui/badge";

export default function AIAssistantPage() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const pets = usePetStore((s) => s.pets);

  const userPets = useMemo(() => {
    return pets.filter((p) => p.userId === currentUser?.id);
  }, [pets, currentUser?.id]);

  return (
    <div className="flex h-[calc(100dvh-8rem)] flex-col gap-4">
      <header className="flex shrink-0 flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:p-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Bot className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Pet Care AI Assistant
            </h1>
            <Badge variant="secondary" className="gap-1 px-2 py-0.5 text-xs">
              <Sparkles className="h-3 w-3 text-primary" />
              Powered by AI
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Ask questions about vaccinations, appointment dates, or health histories.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {userPets.length > 0 ? (
            <div className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>
                {userPets.length} {userPets.length === 1 ? "Pet" : "Pets"} Connected
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs text-amber-600 dark:text-amber-400">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>No pets added yet</span>
            </div>
          )}
        </div>
      </header>

      <div className="min-h-0 flex-1">
        <ChatInterface />
      </div>
    </div>
  );
}
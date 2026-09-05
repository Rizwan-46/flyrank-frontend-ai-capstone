"use client";

import { useMemo, useState } from "react";
import { Sparkles, Bot } from "lucide-react";
import { usePetStore } from "@/store/petStore";
import { useAuthStore } from "@/store/authStore";
import ChatInterface from "@/components/ai/ChatInterface";
import AssistantContextTrigger from "@/components/ai/AssistantContextTrigger";
import AssistantContextDialog from "@/components/ai/AssistantContextDialog";
import { Badge } from "@/components/ui/badge";

export default function AIAssistantPage() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const pets = usePetStore((s) => s.pets);

  const [contextDialogOpen, setContextDialogOpen] = useState(false);

  const userPets = useMemo(() => {
    return pets.filter((p) => p.userId === currentUser?.id);
  }, [pets, currentUser?.id]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 -mb-4 sm:-mb-6 lg:-mb-8">
      <header className="flex shrink-0 flex-row items-center justify-between gap-2 rounded-xl border border-border bg-card p-2 shadow-sm sm:px-4 sm:py-3">
        <div className="flex flex-col justify-center sm:gap-1">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary sm:h-7 sm:w-7">
              <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
            </div>
            <h1 className="text-sm font-semibold tracking-tight text-foreground sm:text-lg">
              PetCare Assistant
            </h1>
            <Badge
              variant="secondary"
              className="gap-0.5 rounded-md px-1 py-0 text-[9px] font-medium sm:gap-1 sm:px-1.5 sm:text-xs"
            >
              <Sparkles className="h-2.5 w-2.5 text-primary sm:h-3 sm:w-3" aria-hidden="true" />
              <span className="whitespace-nowrap">Powered by AI</span>
            </Badge>
          </div>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Ask questions about vaccinations, appointment dates, or health histories.
          </p>
        </div>

        <AssistantContextTrigger
          petCount={userPets.length}
          onClick={() => setContextDialogOpen(true)}
        />
      </header>

      <div className="min-h-0 flex-1">
        <ChatInterface />
      </div>

      <AssistantContextDialog
        open={contextDialogOpen}
        onOpenChange={setContextDialogOpen}
        petCount={userPets.length}
      />
    </div>
  );
}
"use client";

import { Bot, ShieldAlert, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AssistantContextDialog({ open, onOpenChange, petCount }) {
  const hasPets = petCount > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" aria-hidden="true" />
            Assistant Context
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          {hasPets ? (
            <div className="flex items-center gap-3 rounded-lg border border-border bg-background p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" aria-hidden="true" />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {petCount} {petCount === 1 ? "Pet" : "Pets"} Connected
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  The AI securely references their medical records, vaccinations, and
                  appointments to provide personalized answers.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
                <ShieldAlert className="h-5 w-5 text-amber-600" aria-hidden="true" />
              </div>
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-400">
                  No Pets Connected
                </p>
                <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-500">
                  Add a pet to your dashboard so the AI can provide personalized
                  health insights.
                </p>
              </div>
            </div>
          )}

          <div className="rounded-lg border border-border bg-muted/50 p-3 sm:p-4">
            <h3 className="mb-1.5 flex items-center gap-1.5 font-medium text-foreground">
              <AlertTriangle className="h-4 w-4 text-amber-500" aria-hidden="true" />
              Medical Disclaimer
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              While this AI Assistant is designed to help organize and summarize your
              pet&apos;s data, <strong>it can make mistakes and is not a substitute
              for professional veterinary care</strong>. Always consult a qualified
              veterinarian for medical advice, accurate diagnoses, or during
              emergencies.
            </p>
          </div>

          <Button className="w-full" onClick={() => onOpenChange(false)}>
            I Understand
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
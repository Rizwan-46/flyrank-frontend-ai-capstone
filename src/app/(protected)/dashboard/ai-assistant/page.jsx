"use client";

import ChatInterface from "@/components/ai/ChatInterface";

export default function AIAssistantPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Pet Care AI Assistant
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ask questions about your pets&apos; vaccinations, medical history,
          or appointments.
        </p>
      </div>
      <ChatInterface />
    </div>
  );
}
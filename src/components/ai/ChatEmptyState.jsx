import { Sparkles, ArrowRight } from "lucide-react";

const EXAMPLE_PROMPTS = [
  "Summarize my pet's health",
  "What vaccinations are due soon?",
  "Help me prepare for a vet appointment",
  "Explain a medical record term in simple language",
];

export default function ChatEmptyState({ onExampleClick }) {
  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col items-center justify-start gap-8 px-4 py-4 text-center animate-in fade-in zoom-in-95 duration-500 sm:justify-center sm:py-0">
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 shadow-inner">
          <Sparkles className="h-8 w-8 text-primary" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Pet Care Assistant
          </h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Your personal guide to vaccinations, medical history, and appointments. <br/> 
            <span className="font-medium text-foreground/70">Not a substitute for professional veterinary care.</span>
          </p>
        </div>
      </div>

      <div className="grid w-full gap-3 sm:grid-cols-2">
        {EXAMPLE_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onExampleClick(prompt)}
            className="group flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3.5 text-left text-sm text-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-primary/5 active:scale-[0.98]"
          >
            <span className="line-clamp-2">{prompt}</span>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-rotate-45 group-hover:text-primary" />
          </button>
        ))}
      </div>
    </div>
  );
}
import { lazy, Suspense } from "react";
import { Bot, User } from "lucide-react";
import PetHealthSummaryCard from "./PetHealthSummaryCard";
import { ToolInputStreaming, ToolInputAvailable, ToolOutputError } from "./ToolCallStates";

// react-markdown pulls in a genuinely large dependency tree (remark,
// micromark, unified). Lazy-loading it is a real win: an assistant
// reply always waits on a network round-trip to the AI model first,
// so this chunk loads in parallel with that wait.
//
// Uses React.lazy + Suspense (not next/dynamic's `loading` option) —
// dynamic()'s loading component does NOT receive the children/props
// passed to the real component, so it can't show the actual message
// text while loading. Suspense's fallback is defined right where we
// use it, so it can show the real text immediately — no blank bubble,
// ever, even before the chunk finishes loading.
const ReactMarkdown = lazy(() => import("react-markdown"));

export default function ChatMessage({ message, petsById = {}, onRetry }) {
  const isUser = message.role === "user";
  const parts = message.parts || [];
  const hasRenderableContent = parts.some(
    (p) => p.type === "text" || p.type?.startsWith("tool-")
  );

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground"
        }`}
        aria-hidden="true"
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div className="flex min-w-0 max-w-[85%] flex-col gap-2 sm:max-w-[75%]">
        {parts.map((part, i) => {
          if (part.type === "text") {
            return (
              <div
                key={i}
                className={`rounded-2xl px-4 py-2.5 ${
                  isUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground"
                }`}
              >
                <div className="space-y-2 break-words text-sm leading-relaxed [&_a]:underline [&_code]:rounded [&_code]:bg-black/10 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.85em] [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:m-0 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-black/10 [&_pre]:p-3 [&_ul]:list-disc [&_ul]:pl-5">
                  <Suspense fallback={<span>{part.text}</span>}>
                    <ReactMarkdown>{part.text}</ReactMarkdown>
                  </Suspense>
                </div>
              </div>
            );
          }

          if (part.type === "tool-getPetHealthSummary") {
            const petName = part.input?.petId ? petsById[part.input.petId] : undefined;

            switch (part.state) {
              case "input-streaming":
                return <ToolInputStreaming key={i} />;
              case "input-available":
                return <ToolInputAvailable key={i} petName={petName} />;
              case "output-available":
                return <PetHealthSummaryCard key={i} result={part.output} />;
              case "output-error":
                return (
                  <ToolOutputError key={i} errorText={part.errorText} onRetry={onRetry} />
                );
              default:
                return null;
            }
          }

          return null;
        })}

        {!isUser && !hasRenderableContent && (
          <div className="rounded-2xl bg-secondary px-4 py-2.5 text-sm text-muted-foreground">
            No response was generated. Please try asking again.
          </div>
        )}
      </div>
    </div>
  );
}
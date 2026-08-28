import ReactMarkdown from "react-markdown";
import { Bot, User } from "lucide-react";

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";
  
  // Extract text safely regardless of how the SDK packages it
  let content = "";
  if (typeof message.content === "string") {
    content = message.content;
  } else if (message.parts && Array.isArray(message.parts)) {
    content = message.parts
      .filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("");
  }

  return (
    <div className={`flex w-full gap-3 md:gap-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border shadow-sm ${
          isUser
            ? "border-primary/20 bg-primary/10 text-primary"
            : "border-border bg-card text-muted-foreground"
        }`}
        aria-hidden="true"
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Bubble */}
      <div
        className={`relative flex max-w-[85%] flex-col px-5 py-3.5 shadow-sm sm:max-w-[75%] ${
          isUser
            ? "rounded-3xl rounded-br-sm bg-primary text-primary-foreground"
            : "rounded-3xl rounded-bl-sm border border-border bg-card text-card-foreground"
        }`}
      >
        {content.length === 0 ? (
          <span className="flex h-5 items-center gap-1 opacity-60">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
          </span>
        ) : (
          <div className="space-y-3 break-words text-[0.9375rem] leading-relaxed [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4 [&_code]:rounded-md [&_code]:bg-black/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.85em] [&_ol]:ml-4 [&_ol]:list-decimal [&_ol]:space-y-1 [&_p]:m-0 [&_pre]:mt-2 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-black/10 [&_pre]:p-4 [&_ul]:ml-4 [&_ul]:list-disc [&_ul]:space-y-1 dark:[&_code]:bg-white/10 dark:[&_pre]:bg-white/10">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
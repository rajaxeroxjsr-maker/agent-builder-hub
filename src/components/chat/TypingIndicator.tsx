import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex gap-3 md:gap-4 px-4 md:px-6 py-4 md:py-5 chat-message-enter">
      <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
        <Bot className="w-5 h-5 text-primary-foreground" />
      </div>
      
      <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl rounded-bl-md px-5 py-4">
        <div className="typing-indicator flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-gradient-primary" />
          <span className="w-2 h-2 rounded-full bg-gradient-primary" />
          <span className="w-2 h-2 rounded-full bg-gradient-primary" />
        </div>
      </div>
    </div>
  );
}
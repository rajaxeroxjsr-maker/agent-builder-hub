import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { CSSProperties } from "react";

interface ChatMessageProps {
  message: Message;
  style?: CSSProperties;
}

export function ChatMessage({ message, style }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 md:gap-4 chat-message-enter px-4 md:px-6 py-4 md:py-5",
        isUser ? "justify-end" : "justify-start"
      )}
      style={style}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow transition-all duration-300 hover:scale-105">
          <Bot className="w-5 h-5 md:w-5 md:h-5 text-primary-foreground" />
        </div>
      )}
      
      <div
        className={cn(
          "max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 md:px-5 md:py-3.5 transition-all duration-300",
          isUser
            ? "bg-gradient-primary text-primary-foreground rounded-br-md shadow-glow hover:shadow-glow-lg"
            : "bg-card/80 backdrop-blur-sm border border-border/50 text-card-foreground rounded-bl-md hover:border-primary/20 hover:bg-card"
        )}
      >
        <p className="text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap break-words font-normal tracking-[-0.01em]">
          {message.content}
        </p>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-xl bg-secondary flex items-center justify-center border border-border/50 transition-all duration-300 hover:scale-105 hover:border-primary/30">
          <User className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
        </div>
      )}
    </div>
  );
}
import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Bot, User, Copy, Check } from "lucide-react";
import { CSSProperties, useState } from "react";
import { Button } from "@/components/ui/button";
import lumoraLogo from "@/assets/lumora-logo.png";

interface ChatMessageProps {
  message: Message;
  style?: CSSProperties;
}

export function ChatMessage({ message, style }: ChatMessageProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "group py-6 chat-message-enter",
        isUser ? "bg-transparent" : "bg-secondary/30"
      )}
      style={style}
    >
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <div className="flex gap-4 md:gap-5">
          {/* Avatar */}
          <div
            className={cn(
              "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
              isUser
                ? "bg-primary text-primary-foreground"
                : "bg-gradient-primary p-0.5"
            )}
          >
            {isUser ? (
              <User className="w-4 h-4" />
            ) : (
              <img
                src={lumoraLogo}
                alt="Lumora"
                className="w-full h-full rounded-full object-cover"
              />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-foreground">
                {isUser ? "You" : "Lumora"}
              </span>
            </div>
            <div
              className={cn(
                "prose prose-sm max-w-none",
                "prose-p:leading-relaxed prose-p:my-2",
                "prose-pre:bg-secondary prose-pre:border prose-pre:border-border",
                "prose-code:text-primary prose-code:bg-secondary prose-code:px-1 prose-code:py-0.5 prose-code:rounded",
                "text-foreground/90"
              )}
            >
              <p className="whitespace-pre-wrap break-words leading-7">
                {message.content}
              </p>
            </div>

            {/* Actions */}
            {!isUser && message.content && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pt-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

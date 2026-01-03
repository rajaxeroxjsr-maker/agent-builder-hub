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
      className="group py-4 chat-message-enter"
      style={style}
    >
      <div className="max-w-3xl mx-auto px-4">
        <div className={cn(
          "flex gap-3 p-4 rounded-2xl",
          isUser 
            ? "bg-primary/5 border border-primary/10" 
            : "bg-card border border-border/50 shadow-sm"
        )}>
          {/* Avatar */}
          <div
            className={cn(
              "flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center shadow-sm",
              isUser
                ? "bg-primary/20"
                : "bg-secondary"
            )}
          >
            {isUser ? (
              <User className="w-4 h-4 text-primary" />
            ) : (
              <img
                src={lumoraLogo}
                alt="Lumora"
                className="w-full h-full rounded-xl object-cover"
              />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-semibold text-sm text-foreground">
                {isUser ? "You" : "Lumora"}
              </span>
            </div>

            {/* Image attachments */}
            {message.images && message.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {message.images.map((image, index) => (
                  <div key={index} className="relative group/image">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="max-w-[200px] max-h-[200px] rounded-xl object-cover border border-border/50 shadow-sm"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="text-foreground text-[15px] leading-7">
              <p className="whitespace-pre-wrap break-words">
                {message.content}
              </p>
            </div>

            {/* Actions */}
            {!isUser && message.content && (
              <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors duration-150"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <Copy className="h-4 w-4" />
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

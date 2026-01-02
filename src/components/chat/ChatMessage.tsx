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
      className="group py-5 chat-message-enter"
      style={style}
    >
      <div className="max-w-2xl mx-auto px-4 md:px-6">
        <div className="flex gap-3">
          {/* Avatar */}
          <div
            className={cn(
              "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center",
              isUser
                ? "bg-muted"
                : "bg-muted"
            )}
          >
            {isUser ? (
              <User className="w-3.5 h-3.5 text-foreground" />
            ) : (
              <img
                src={lumoraLogo}
                alt="Lumora"
                className="w-full h-full rounded-full object-cover"
              />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm text-foreground">
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
                      className="max-w-[200px] max-h-[200px] rounded-lg object-cover border border-border/50"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="text-foreground/90 text-[15px] leading-7">
              <p className="whitespace-pre-wrap break-words">
                {message.content}
              </p>
            </div>

            {/* Actions */}
            {!isUser && message.content && (
              <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors duration-150"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-primary" />
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

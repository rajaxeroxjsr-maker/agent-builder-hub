import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Paperclip, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  return (
    <div className="sticky bottom-0 bg-gradient-to-t from-background via-background/95 to-transparent pt-6 pb-4 px-4">
      <div className="max-w-3xl mx-auto">
        <div
          className={cn(
            "relative flex items-end gap-2 bg-secondary/50 border rounded-2xl transition-all duration-300",
            isFocused
              ? "border-primary/30 shadow-lg shadow-primary/5"
              : "border-border hover:border-border/80"
          )}
        >
          {/* Attachment button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 shrink-0 ml-1 mb-1 text-muted-foreground hover:text-foreground"
          >
            <Paperclip className="h-5 w-5" />
          </Button>

          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Message Lumora..."
            disabled={isLoading}
            className={cn(
              "flex-1 min-h-[52px] max-h-[200px] resize-none border-0 bg-transparent",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "placeholder:text-muted-foreground/60 text-[15px] py-3.5 px-0",
              "leading-relaxed"
            )}
            rows={1}
          />

          <div className="flex items-center gap-1 mr-1 mb-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-muted-foreground hover:text-foreground"
            >
              <Mic className="h-5 w-5" />
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={!input.trim() || isLoading}
              size="icon"
              className={cn(
                "h-9 w-9 rounded-lg shrink-0 transition-all duration-200",
                input.trim() && !isLoading
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground/50 text-center mt-3">
          Lumora can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}

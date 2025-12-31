import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Sparkles } from "lucide-react";
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
      // Reset textarea height
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

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  return (
    <div className="p-4 md:p-6 bg-gradient-to-t from-background via-background to-transparent relative z-10">
      <div className="max-w-3xl mx-auto">
        <div 
          className={cn(
            "relative flex items-end gap-3 bg-card/60 backdrop-blur-xl border rounded-2xl p-2.5 md:p-3 transition-all duration-500 input-focus-ring",
            isFocused 
              ? "border-primary/40 shadow-glow" 
              : "border-border/50 shadow-soft hover:border-border"
          )}
        >
          {/* Animated gradient border on focus */}
          <div 
            className={cn(
              "absolute inset-0 rounded-2xl bg-gradient-primary opacity-0 transition-opacity duration-500 -z-10 blur-xl",
              isFocused && "opacity-10"
            )}
          />

          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ask Lumora anything..."
            disabled={isLoading}
            className={cn(
              "flex-1 min-h-[48px] max-h-[200px] resize-none border-0 bg-transparent",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "placeholder:text-muted-foreground/50 text-[15px] py-3 px-3",
              "tracking-[-0.01em] font-normal"
            )}
            rows={1}
          />
          
          <Button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            size="icon"
            className={cn(
              "h-11 w-11 rounded-xl shrink-0 transition-all duration-300 button-press",
              input.trim() && !isLoading
                ? "bg-gradient-primary hover:opacity-90 shadow-glow"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
            )}
          >
            {isLoading ? (
              <Sparkles className="h-5 w-5 animate-pulse" />
            ) : (
              <ArrowUp className="h-5 w-5" />
            )}
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground/60 text-center mt-4 tracking-wide">
          Lumora can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}
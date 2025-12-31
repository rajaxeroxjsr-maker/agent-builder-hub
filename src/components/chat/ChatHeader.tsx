import { Button } from "@/components/ui/button";
import { ChevronDown, Share, Sparkles } from "lucide-react";

interface ChatHeaderProps {
  title?: string;
  hasMessages: boolean;
}

export function ChatHeader({ title = "Lumora", hasMessages }: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          className="gap-2 font-semibold text-foreground hover:bg-secondary"
        >
          <Sparkles className="h-4 w-4 text-primary" />
          <span>{hasMessages && title !== "Lumora" ? title : "Lumora"}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {hasMessages && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <Share className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        )}
      </div>
    </header>
  );
}

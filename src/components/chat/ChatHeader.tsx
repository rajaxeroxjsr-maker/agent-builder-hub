import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import lumoraLogo from "@/assets/lumora-logo.png";

interface ChatHeaderProps {
  onClear: () => void;
  hasMessages: boolean;
}

export function ChatHeader({ onClear, hasMessages }: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-20 px-4 md:px-6 py-4 border-b border-border/40 bg-background/70 backdrop-blur-2xl">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute inset-0 rounded-xl bg-gradient-primary opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500" />
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl overflow-hidden flex items-center justify-center bg-card/50 border border-border/50 relative transition-all duration-300 group-hover:border-primary/30 group-hover:scale-105">
              <img 
                src={lumoraLogo} 
                alt="lumora.ai" 
                className="w-7 h-7 md:w-8 md:h-8 object-contain logo-glow" 
              />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg md:text-xl font-semibold tracking-tight text-foreground">
              lumora<span className="text-gradient">.ai</span>
            </h1>
            <span className="text-[11px] md:text-xs text-muted-foreground/70 font-medium tracking-wide">
              Intelligence, Made Friendly
            </span>
          </div>
        </div>

        {hasMessages && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all duration-300 rounded-xl button-press"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-medium">New chat</span>
          </Button>
        )}
      </div>
    </header>
  );
}
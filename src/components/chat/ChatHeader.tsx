import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import lumoraLogo from "@/assets/lumora-logo.png";

interface ChatHeaderProps {
  onClear: () => void;
  hasMessages: boolean;
}

export function ChatHeader({ onClear, hasMessages }: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center">
          <img src={lumoraLogo} alt="lumora.ai" className="w-10 h-10 object-contain" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">lumora<span className="text-primary">.ai</span></h1>
          <p className="text-xs text-muted-foreground">Intelligence, Made Friendly</p>
        </div>
      </div>
      
      {hasMessages && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear chat
        </Button>
      )}
    </header>
  );
}

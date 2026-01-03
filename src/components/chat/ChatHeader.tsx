import { Button } from "@/components/ui/button";
import { ChevronDown, Check, Zap, Brain, Sparkles, Menu, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import lumoraLogo from "@/assets/lumora-logo.png";

interface ChatHeaderProps {
  title?: string;
  hasMessages: boolean;
  selectedModel: string;
  onModelChange: (model: string) => void;
  isMobile: boolean;
  onOpenSidebar: () => void;
}

const models = [
  {
    id: "openai/gpt-5",
    name: "GPT-5",
    description: "Most capable",
    icon: Brain,
  },
  {
    id: "openai/gpt-5-mini",
    name: "GPT-5 Mini",
    description: "Faster",
    icon: Zap,
  },
  {
    id: "openai/gpt-5-nano",
    name: "GPT-5 Nano",
    description: "Fastest",
    icon: Sparkles,
  },
];

export function ChatHeader({ 
  title = "Lumora", 
  hasMessages,
  selectedModel,
  onModelChange,
  isMobile,
  onOpenSidebar,
}: ChatHeaderProps) {
  const currentModel = models.find(m => m.id === selectedModel) || models[0];
  const CurrentIcon = currentModel.icon;

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-card shadow-sm border-b border-border/30">
      <div className="flex items-center gap-3">
        {/* Menu button for mobile */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl"
            onClick={onOpenSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        {/* Logo and Title */}
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
            <Sun className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-foreground">Lumora</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Model Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="default"
              className="gap-2 font-medium h-10 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
            >
              <CurrentIcon className="h-4 w-4" />
              <span className="text-sm">{currentModel.name}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl">
            {models.map((model) => {
              const Icon = model.icon;
              return (
                <DropdownMenuItem
                  key={model.id}
                  onClick={() => onModelChange(model.id)}
                  className="flex items-center gap-3 py-2.5 rounded-lg"
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    selectedModel === model.id
                      ? "bg-primary/20 text-primary"
                      : "bg-secondary text-muted-foreground"
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{model.name}</p>
                    <p className="text-xs text-muted-foreground">{model.description}</p>
                  </div>
                  {selectedModel === model.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Avatar */}
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-md border-2 border-card">
          <span className="text-sm font-bold text-accent-foreground">U</span>
        </div>
      </div>
    </header>
  );
}

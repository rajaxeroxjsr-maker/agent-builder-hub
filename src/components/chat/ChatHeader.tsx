import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Check, Zap, Brain, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  title?: string;
  hasMessages: boolean;
  selectedModel: string;
  onModelChange: (model: string) => void;
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
}: ChatHeaderProps) {
  const currentModel = models.find(m => m.id === selectedModel) || models[0];
  const CurrentIcon = currentModel.icon;

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="gap-2 font-semibold text-foreground hover:bg-secondary h-9 px-3"
            >
              <CurrentIcon className="h-4 w-4 text-primary" />
              <span className="text-sm">{currentModel.name}</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {models.map((model) => {
              const Icon = model.icon;
              return (
                <DropdownMenuItem
                  key={model.id}
                  onClick={() => onModelChange(model.id)}
                  className="flex items-center gap-3 py-2.5"
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
      </div>

      <div className="flex items-center gap-2">
        {/* Could add share/export buttons here */}
      </div>
    </header>
  );
}

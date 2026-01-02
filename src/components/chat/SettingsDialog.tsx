import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Zap, 
  Brain, 
  Sparkles,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const models = [
  {
    id: "openai/gpt-5",
    name: "GPT-5",
    description: "Most capable model for complex tasks",
    icon: Brain,
    badge: "Recommended",
  },
  {
    id: "openai/gpt-5-mini",
    name: "GPT-5 Mini",
    description: "Faster responses, great for most tasks",
    icon: Zap,
    badge: null,
  },
  {
    id: "openai/gpt-5-nano",
    name: "GPT-5 Nano",
    description: "Fastest, best for simple tasks",
    icon: Sparkles,
    badge: null,
  },
];

export function SettingsDialog({ 
  open, 
  onOpenChange, 
  selectedModel, 
  onModelChange 
}: SettingsDialogProps) {
  const [tempModel, setTempModel] = useState(selectedModel);

  const handleSave = () => {
    onModelChange(tempModel);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Model Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">Model</Label>
            <RadioGroup
              value={tempModel}
              onValueChange={setTempModel}
              className="space-y-2"
            >
              {models.map((model) => (
                <label
                  key={model.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200",
                    tempModel === model.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30 hover:bg-secondary/50"
                  )}
                >
                  <RadioGroupItem value={model.id} className="sr-only" />
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                    tempModel === model.id
                      ? "bg-primary/20 text-primary"
                      : "bg-secondary text-muted-foreground"
                  )}>
                    <model.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{model.name}</span>
                      {model.badge && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-primary/20 text-primary">
                          {model.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {model.description}
                    </p>
                  </div>
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 shrink-0 transition-all",
                    tempModel === model.id
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/30"
                  )}>
                    {tempModel === model.id && (
                      <div className="w-full h-full rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </RadioGroup>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Theme */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">Theme</Label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2 justify-center"
              >
                <Sun className="h-4 w-4" />
                Light
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2 justify-center bg-secondary border-primary/30"
              >
                <Moon className="h-4 w-4" />
                Dark
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2 justify-center"
              >
                <Monitor className="h-4 w-4" />
                System
              </Button>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Other Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Send with Enter</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Use Shift+Enter for new line
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Sound effects</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Play sounds for messages
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

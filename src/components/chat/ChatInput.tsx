import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Paperclip, X, ImageIcon, FileText, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatInputProps {
  onSend: (message: string, files?: File[]) => void;
  isLoading: boolean;
  model?: string;
}

export function ChatInput({ onSend, isLoading, model = "GPT-5" }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if ((input.trim() || attachedFiles.length > 0) && !isLoading) {
      onSend(input, attachedFiles.length > 0 ? attachedFiles : undefined);
      setInput("");
      setAttachedFiles([]);
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    setAttachedFiles(prev => [...prev, ...imageFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    setAttachedFiles(prev => [...prev, ...imageFiles]);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const modelName = model.split('/').pop()?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || "GPT-5";

  return (
    <div className="sticky bottom-0 bg-background pt-4 pb-4 px-4">
      <div className="max-w-3xl mx-auto">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative flex flex-col bg-card rounded-2xl border border-border/50 shadow-lg transition-all duration-200",
            isFocused ? "ring-2 ring-primary/20 border-primary/30" : "",
            dragOver && "ring-2 ring-primary bg-primary/5"
          )}
        >
          {/* Attached files preview */}
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 px-4 pt-3">
              {attachedFiles.map((file, index) => (
                <div
                  key={index}
                  className="relative group/file flex items-center gap-2 bg-secondary rounded-xl border border-border/50 overflow-hidden"
                >
                  {file.type.startsWith('image/') && (
                    <>
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="h-14 w-14 object-cover"
                      />
                      <div className="pr-8 py-2">
                        <p className="text-xs font-medium text-foreground truncate max-w-[120px]">
                          {file.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {(file.size / 1024).toFixed(0)} KB
                        </p>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 bg-card hover:bg-destructive hover:text-destructive-foreground rounded-full p-1 transition-colors shadow-sm"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex items-end gap-2 p-3">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*"
            />

            {/* Attachment button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-10 w-10 shrink-0 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary"
                  >
                    <Paperclip className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Attach image</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={`Ask ${modelName}...`}
              disabled={isLoading}
              className={cn(
                "flex-1 min-h-[44px] max-h-[200px] resize-none border-0 bg-transparent",
                "focus-visible:ring-0 focus-visible:ring-offset-0",
                "placeholder:text-muted-foreground/60 text-[15px] py-3 px-1",
                "leading-relaxed"
              )}
              rows={1}
            />

            <div className="flex items-center gap-1">
              <Button
                onClick={handleSubmit}
                disabled={(!input.trim() && attachedFiles.length === 0) || isLoading}
                size="icon"
                className={cn(
                  "h-10 w-10 rounded-xl shrink-0 transition-all duration-200 shadow-md",
                  (input.trim() || attachedFiles.length > 0) && !isLoading
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                <ArrowUp className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground/60 text-center mt-3">
          {modelName} can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}

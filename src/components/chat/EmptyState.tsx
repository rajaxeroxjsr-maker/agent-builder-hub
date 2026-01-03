import { Sparkles, Code, Lightbulb, BookOpen, Zap } from "lucide-react";
import lumoraLogo from "@/assets/lumora-logo.png";

interface EmptyStateProps {
  onSuggestionClick: (message: string) => void;
}

const suggestions = [
  {
    icon: Code,
    title: "Help me write code",
    prompt: "Help me write a React component that displays a user profile card",
  },
  {
    icon: Lightbulb,
    title: "Explain a concept",
    prompt: "Explain how async/await works in JavaScript",
  },
  {
    icon: BookOpen,
    title: "Summarize content",
    prompt: "Summarize the key points of effective communication",
  },
  {
    icon: Zap,
    title: "Creative ideas",
    prompt: "Give me 5 creative ideas for a side project",
  },
];

export function EmptyState({ onSuggestionClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4">
      {/* Logo & Welcome */}
      <div className="flex flex-col items-center mb-10">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-150" />
          <img
            src={lumoraLogo}
            alt="Lumora"
            className="relative h-20 w-20 rounded-2xl shadow-xl"
          />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
          How can I help you today?
        </h1>
        <p className="text-muted-foreground text-center max-w-md">
          I'm Lumora, your AI assistant. Ask me anything or choose a suggestion below.
        </p>
      </div>

      {/* Suggestions Grid - Card style like reference */}
      <div className="w-full max-w-2xl space-y-3">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion.prompt)}
            className="group w-full flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 text-left"
          >
            <div className="flex-shrink-0 w-5 h-5 rounded-md border-2 border-muted-foreground/30 group-hover:border-primary/50 transition-colors" />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                {suggestion.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                {suggestion.prompt}
              </p>
            </div>
            <suggestion.icon className="h-5 w-5 text-muted-foreground/50 group-hover:text-primary/50 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}

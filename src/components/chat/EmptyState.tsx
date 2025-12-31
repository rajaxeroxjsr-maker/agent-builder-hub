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
          <div className="absolute inset-0 bg-gradient-primary rounded-full blur-xl opacity-30 scale-150" />
          <img
            src={lumoraLogo}
            alt="Lumora"
            className="relative h-16 w-16 rounded-2xl shadow-lg"
          />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-tight">
          How can I help you today?
        </h1>
        <p className="text-muted-foreground text-center max-w-md">
          I'm Lumora, your AI assistant. Ask me anything or choose a suggestion below.
        </p>
      </div>

      {/* Suggestions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSuggestionClick(suggestion.prompt)}
            className="group flex items-start gap-3 p-4 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-primary/20 transition-all duration-200 text-left"
          >
            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <suggestion.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                {suggestion.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {suggestion.prompt}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

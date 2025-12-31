import { MessageSquare, Lightbulb, Code } from "lucide-react";
import lumoraLogo from "@/assets/lumora-logo.png";

interface SuggestionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

function SuggestionCard({ icon, title, description, onClick }: SuggestionCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start gap-2 p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-accent/50 transition-all duration-200 text-left group"
    >
      <div className="text-primary group-hover:scale-110 transition-transform duration-200">
        {icon}
      </div>
      <h3 className="font-medium text-sm text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
    </button>
  );
}

interface EmptyStateProps {
  onSuggestionClick: (message: string) => void;
}

export function EmptyState({ onSuggestionClick }: EmptyStateProps) {
  const suggestions = [
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: "Have a conversation",
      description: "Ask me anything and I'll do my best to help you.",
      prompt: "Hi! Can you tell me a bit about yourself and what you can help me with?",
    },
    {
      icon: <Lightbulb className="w-5 h-5" />,
      title: "Brainstorm ideas",
      description: "Let's think through problems and come up with creative solutions.",
      prompt: "Help me brainstorm some creative project ideas for a weekend hackathon.",
    },
    {
      icon: <Code className="w-5 h-5" />,
      title: "Learn something new",
      description: "I can explain complex topics in simple terms.",
      prompt: "Explain how machine learning works in simple terms.",
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center mb-6 animate-pulse-glow">
        <img src={lumoraLogo} alt="lumora.ai" className="w-20 h-20 object-contain" />
      </div>
      
      <h2 className="text-2xl font-semibold text-foreground mb-2 tracking-tight">
        How can I help you today?
      </h2>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Start a conversation or try one of these suggestions to get started.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full">
        {suggestions.map((suggestion, index) => (
          <SuggestionCard
            key={index}
            icon={suggestion.icon}
            title={suggestion.title}
            description={suggestion.description}
            onClick={() => onSuggestionClick(suggestion.prompt)}
          />
        ))}
      </div>
    </div>
  );
}

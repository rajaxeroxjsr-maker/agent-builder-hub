import { MessageSquare, Lightbulb, Code } from "lucide-react";
import lumoraLogo from "@/assets/lumora-logo.png";

interface SuggestionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  delay: string;
}

function SuggestionCard({ icon, title, description, onClick, delay }: SuggestionCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start gap-3 p-5 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/40 hover:border-primary/30 hover:bg-card/80 transition-all duration-500 text-left group card-hover fade-in-up shimmer"
      style={{ animationDelay: delay }}
    >
      <div className="w-10 h-10 rounded-xl bg-gradient-primary/10 flex items-center justify-center text-primary group-hover:bg-gradient-primary group-hover:text-primary-foreground transition-all duration-500 group-hover:scale-110 group-hover:shadow-glow">
        {icon}
      </div>
      <div className="space-y-1.5">
        <h3 className="font-semibold text-[15px] text-foreground tracking-tight group-hover:text-gradient transition-all duration-300">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
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
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 md:py-20">
      {/* Logo with glow effect */}
      <div className="relative mb-8 fade-in-up">
        <div className="absolute inset-0 w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-gradient-primary blur-2xl opacity-30 animate-pulse-glow" />
        <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-3xl overflow-hidden flex items-center justify-center bg-card/30 backdrop-blur-sm border border-border/30">
          <img 
            src={lumoraLogo} 
            alt="lumora.ai" 
            className="w-16 h-16 md:w-20 md:h-20 object-contain logo-glow float-animation" 
          />
        </div>
      </div>
      
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 tracking-tight text-center fade-in-up stagger-1">
        How can I help you <span className="text-gradient">today</span>?
      </h2>
      <p className="text-muted-foreground text-center max-w-md mb-10 text-sm md:text-base leading-relaxed fade-in-up stagger-2">
        Intelligence, Made Friendly — Start a conversation or try one of these suggestions.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full">
        {suggestions.map((suggestion, index) => (
          <SuggestionCard
            key={index}
            icon={suggestion.icon}
            title={suggestion.title}
            description={suggestion.description}
            onClick={() => onSuggestionClick(suggestion.prompt)}
            delay={`${0.3 + index * 0.1}s`}
          />
        ))}
      </div>
    </div>
  );
}
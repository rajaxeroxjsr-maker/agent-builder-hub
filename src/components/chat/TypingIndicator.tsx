import lumoraLogo from "@/assets/lumora-logo.png";

export function TypingIndicator() {
  return (
    <div className="py-6 bg-secondary/30 chat-message-enter">
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <div className="flex gap-4 md:gap-5">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-primary p-0.5">
            <img
              src={lumoraLogo}
              alt="Lumora"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="flex-1 space-y-2">
            <span className="font-semibold text-sm text-foreground">Lumora</span>
            <div className="flex gap-1.5 pt-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

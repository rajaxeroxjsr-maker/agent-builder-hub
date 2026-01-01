import lumoraLogo from "@/assets/lumora-logo.png";

export function TypingIndicator() {
  return (
    <div className="py-5 chat-message-enter">
      <div className="max-w-2xl mx-auto px-4 md:px-6">
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-muted">
            <img
              src={lumoraLogo}
              alt="Lumora"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="flex-1 pt-0.5">
            <span className="font-medium text-sm text-foreground mb-1 block">Lumora</span>
            <div className="typing-indicator flex gap-1 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

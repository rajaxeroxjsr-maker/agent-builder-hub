import { useEffect, useRef } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatHeader } from "./ChatHeader";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { EmptyState } from "./EmptyState";

export function ChatContainer() {
  const { messages, isLoading, sendMessage, clearChat } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const showTypingIndicator = isLoading && messages[messages.length - 1]?.role === "user";

  return (
    <div className="flex flex-col h-screen relative overflow-hidden">
      {/* Lovable-style animated background */}
      <div className="lovable-bg">
        <div className="gradient-orb gradient-orb-1" />
        <div className="gradient-orb gradient-orb-2" />
        <div className="gradient-orb gradient-orb-3" />
      </div>
      <div className="vignette noise-overlay" />

      <ChatHeader onClear={clearChat} hasMessages={messages.length > 0} />
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-thin relative z-10"
      >
        {messages.length === 0 ? (
          <EmptyState onSuggestionClick={sendMessage} />
        ) : (
          <div className="max-w-3xl mx-auto pb-6">
            {messages.map((message, index) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                style={{ animationDelay: `${index * 0.05}s` }}
              />
            ))}
            {showTypingIndicator && <TypingIndicator />}
          </div>
        )}
      </div>
      
      <ChatInput onSend={sendMessage} isLoading={isLoading} />
    </div>
  );
}
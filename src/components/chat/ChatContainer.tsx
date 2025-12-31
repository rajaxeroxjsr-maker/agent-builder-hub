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
    <div className="flex flex-col h-screen bg-background relative overflow-hidden noise-overlay">
      {/* Ambient background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-start/[0.03] blur-[120px] animate-float" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-end/[0.03] blur-[100px] animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] rounded-full bg-gradient-mid/[0.02] blur-[80px] animate-float" style={{ animationDelay: '-1.5s' }} />
      </div>

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
import { useEffect, useRef, useState } from "react";
import { useChat } from "@/hooks/useChat";
import { useConversations } from "@/hooks/useConversations";
import { useAuth } from "@/hooks/useAuth";
import { useSettings } from "@/hooks/useSettings";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChatHeader } from "./ChatHeader";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { EmptyState } from "./EmptyState";
import { Sidebar } from "./Sidebar";
import { SettingsDialog } from "./SettingsDialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ChatContainerProps {
  initialMessage?: string;
}

export function ChatContainer({ initialMessage }: ChatContainerProps) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const { model, updateModel } = useSettings();

  const {
    conversations,
    activeConversation,
    activeConversationId,
    setActiveConversationId,
    createConversation,
    addMessageToConversation,
    updateMessageInConversation,
    deleteConversation,
  } = useConversations();

  const { messages, isLoading, sendMessage, stopGenerating, setMessagesFromConversation } = useChat({
    model,
    onAddMessage: (message) => {
      if (activeConversationId) {
        addMessageToConversation(activeConversationId, message);
      }
    },
    onUpdateMessage: (messageId, content) => {
      if (activeConversationId) {
        updateMessageInConversation(activeConversationId, messageId, content);
      }
    },
  });

  // Sync messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      setMessagesFromConversation(activeConversation.messages);
    } else {
      setMessagesFromConversation([]);
    }
  }, [activeConversationId, activeConversation, setMessagesFromConversation]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  // Handle initial message from landing page
  const initialMessageSent = useRef(false);
  useEffect(() => {
    if (initialMessage && !initialMessageSent.current) {
      initialMessageSent.current = true;
      const convId = createConversation();
      if (convId) {
        sendMessage(initialMessage);
      }
    }
  }, [initialMessage, createConversation, sendMessage]);

  // Close sidebar when selecting a conversation on mobile
  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleSendMessage = async (content: string, files?: File[]) => {
    let convId = activeConversationId;
    if (!convId) {
      convId = createConversation();
    }
    await sendMessage(content, files);
  };

  const handleNewChat = () => {
    createConversation();
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const showTypingIndicator =
    isLoading && messages[messages.length - 1]?.role === "user";

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "h-full z-50",
          isMobile
            ? "fixed left-0 top-0 transition-transform duration-300 ease-in-out"
            : "relative",
          isMobile && !sidebarOpen && "-translate-x-full"
        )}
      >
        <Sidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          onNewChat={handleNewChat}
          onDeleteConversation={deleteConversation}
          isMobile={isMobile}
          onCloseMobile={() => setSidebarOpen(false)}
          user={user}
          onSignOut={handleSignOut}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20 pointer-events-none" />

        <ChatHeader
          title={activeConversation?.title}
          hasMessages={messages.length > 0}
          selectedModel={model}
          onModelChange={updateModel}
          isMobile={isMobile}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto scrollbar-thin relative z-10"
        >
          {messages.length === 0 ? (
            <EmptyState onSuggestionClick={handleSendMessage} />
          ) : (
            <div className="py-4">
              {messages.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  style={{ animationDelay: `${Math.min(index * 0.02, 0.2)}s` }}
                />
              ))}
              {showTypingIndicator && <TypingIndicator />}
            </div>
          )}
        </div>

        <ChatInput 
          onSend={handleSendMessage} 
          onStop={stopGenerating}
          isLoading={isLoading} 
          model={model}
        />
      </div>

      {/* Settings Dialog */}
      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        selectedModel={model}
        onModelChange={updateModel}
      />
    </div>
  );
}

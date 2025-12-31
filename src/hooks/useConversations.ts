import { useState, useCallback, useEffect } from "react";
import { Conversation, Message } from "@/types/chat";

const STORAGE_KEY = "lumora-conversations";

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Load conversations from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const hydrated = parsed.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }));
        setConversations(hydrated);
      } catch (e) {
        console.error("Failed to parse conversations:", e);
      }
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    }
  }, [conversations]);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  const createConversation = useCallback(() => {
    const newConv: Conversation = {
      id: crypto.randomUUID(),
      title: "New chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    return newConv.id;
  }, []);

  const updateConversation = useCallback(
    (id: string, updates: Partial<Conversation>) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === id
            ? { ...conv, ...updates, updatedAt: new Date() }
            : conv
        )
      );
    },
    []
  );

  const addMessageToConversation = useCallback(
    (conversationId: string, message: Message) => {
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === conversationId) {
            const updatedMessages = [...conv.messages, message];
            // Auto-generate title from first user message
            const title =
              conv.title === "New chat" && message.role === "user"
                ? message.content.slice(0, 30) + (message.content.length > 30 ? "..." : "")
                : conv.title;
            return {
              ...conv,
              messages: updatedMessages,
              title,
              updatedAt: new Date(),
            };
          }
          return conv;
        })
      );
    },
    []
  );

  const updateMessageInConversation = useCallback(
    (conversationId: string, messageId: string, content: string) => {
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              messages: conv.messages.map((msg) =>
                msg.id === messageId ? { ...msg, content } : msg
              ),
              updatedAt: new Date(),
            };
          }
          return conv;
        })
      );
    },
    []
  );

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => prev.filter((conv) => conv.id !== id));
      if (activeConversationId === id) {
        setActiveConversationId(null);
      }
    },
    [activeConversationId]
  );

  const clearAllConversations = useCallback(() => {
    setConversations([]);
    setActiveConversationId(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    conversations,
    activeConversation,
    activeConversationId,
    setActiveConversationId,
    createConversation,
    updateConversation,
    addMessageToConversation,
    updateMessageInConversation,
    deleteConversation,
    clearAllConversations,
  };
}

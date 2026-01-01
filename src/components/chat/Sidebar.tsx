import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  MessageSquare,
  Trash2,
  PanelLeftClose,
  PanelLeft,
  Settings,
  Sparkles,
  LogOut,
  LogIn,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Conversation } from "@/types/chat";
import lumoraLogo from "@/assets/lumora-logo.png";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  user: SupabaseUser | null;
  onSignOut: () => void;
}

export function Sidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  isCollapsed,
  onToggleCollapse,
  user,
  onSignOut,
}: SidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Group conversations by date
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const groupedConversations = {
    today: conversations.filter(
      (c) => c.updatedAt.toDateString() === today.toDateString()
    ),
    yesterday: conversations.filter(
      (c) => c.updatedAt.toDateString() === yesterday.toDateString()
    ),
    lastWeek: conversations.filter(
      (c) =>
        c.updatedAt > lastWeek &&
        c.updatedAt.toDateString() !== today.toDateString() &&
        c.updatedAt.toDateString() !== yesterday.toDateString()
    ),
    older: conversations.filter((c) => c.updatedAt <= lastWeek),
  };

  const renderGroup = (title: string, items: Conversation[]) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-4">
        {!isCollapsed && (
          <p className="text-xs font-medium text-muted-foreground/70 px-3 py-2 uppercase tracking-wider">
            {title}
          </p>
        )}
        {items.map((conversation) => (
          <div
            key={conversation.id}
            className="relative group"
            onMouseEnter={() => setHoveredId(conversation.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 h-10 px-3 rounded-lg transition-all duration-200",
                "hover:bg-secondary/80",
                activeConversationId === conversation.id &&
                  "bg-secondary text-foreground"
              )}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
              {!isCollapsed && (
                <span className="truncate text-sm font-normal">
                  {conversation.title}
                </span>
              )}
            </Button>
            {hoveredId === conversation.id && !isCollapsed && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConversation(conversation.id);
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 relative",
        isCollapsed ? "w-[60px]" : "w-[260px]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <img
              src={lumoraLogo}
              alt="Lumora"
              className="h-7 w-7 rounded-lg"
            />
            <span className="font-semibold text-sidebar-foreground tracking-tight">
              Lumora
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 shrink-0 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
            isCollapsed && "mx-auto"
          )}
          onClick={onToggleCollapse}
        >
          {isCollapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <Button
          onClick={onNewChat}
          className={cn(
            "w-full gap-2 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 transition-all duration-200",
            isCollapsed ? "px-0" : "justify-start"
          )}
        >
          <Plus className="h-4 w-4" />
          {!isCollapsed && <span>New chat</span>}
        </Button>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1 px-2">
        {renderGroup("Today", groupedConversations.today)}
        {renderGroup("Yesterday", groupedConversations.yesterday)}
        {renderGroup("Previous 7 Days", groupedConversations.lastWeek)}
        {renderGroup("Older", groupedConversations.older)}

        {conversations.length === 0 && !isCollapsed && (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-sidebar-accent flex items-center justify-center mb-3">
              <Sparkles className="h-5 w-5 text-sidebar-foreground/50" />
            </div>
            <p className="text-sm text-sidebar-foreground/70">
              No conversations yet
            </p>
            <p className="text-xs text-sidebar-foreground/50 mt-1">
              Start a new chat to begin
            </p>
          </div>
        )}
      </ScrollArea>

      {/* Footer - User section */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        {user ? (
          <>
            <div className={cn(
              "flex items-center gap-2 px-2 py-1.5 rounded-lg bg-sidebar-accent/50",
              isCollapsed && "justify-center px-0"
            )}>
              <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <User className="h-3.5 w-3.5 text-primary" />
              </div>
              {!isCollapsed && (
                <span className="text-sm text-sidebar-foreground truncate">
                  {user.user_metadata?.display_name || user.email?.split('@')[0]}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              onClick={onSignOut}
              className={cn(
                "w-full gap-2 text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10",
                isCollapsed ? "px-0 justify-center" : "justify-start"
              )}
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span>Sign out</span>}
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            onClick={() => navigate("/auth")}
            className={cn(
              "w-full gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
              isCollapsed ? "px-0 justify-center" : "justify-start"
            )}
          >
            <LogIn className="h-4 w-4" />
            {!isCollapsed && <span>Sign in</span>}
          </Button>
        )}
      </div>
    </div>
  );
}

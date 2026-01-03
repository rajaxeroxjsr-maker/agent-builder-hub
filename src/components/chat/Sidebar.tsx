import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Trash2,
  PanelLeftClose,
  Settings,
  Sparkles,
  LogOut,
  LogIn,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Conversation } from "@/types/chat";
import { User as SupabaseUser } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
  isMobile: boolean;
  onCloseMobile: () => void;
  user: SupabaseUser | null;
  onSignOut: () => void;
  onOpenSettings: () => void;
}

export function Sidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  isMobile,
  onCloseMobile,
  user,
  onSignOut,
  onOpenSettings,
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
        <p className="text-xs font-medium text-muted-foreground/70 px-3 py-2 uppercase tracking-wider">
          {title}
        </p>
        {items.map((conversation) => (
          <div
            key={conversation.id}
            className="relative group px-2"
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
              <span className="truncate text-sm font-normal">
                {conversation.title}
              </span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive",
                hoveredId === conversation.id && "opacity-100"
              )}
              onClick={(e) => {
                e.stopPropagation();
                onDeleteConversation(conversation.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-card border-r border-border/30 shadow-sm",
        isMobile ? "w-[280px]" : "w-[260px]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/30">
        {isMobile ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl"
            onClick={onCloseMobile}
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        ) : (
          <div className="h-9 w-9" /> 
        )}
        <Button
          onClick={onNewChat}
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1 px-2">
        <div className="py-3">
          <Button
            onClick={onNewChat}
            variant="ghost"
            className="w-full justify-start gap-3 h-11 px-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary mb-2"
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm font-medium">New chat</span>
          </Button>
        </div>
        
        {renderGroup("Today", groupedConversations.today)}
        {renderGroup("Yesterday", groupedConversations.yesterday)}
        {renderGroup("Previous 7 Days", groupedConversations.lastWeek)}
        {renderGroup("Older", groupedConversations.older)}

        {conversations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-3">
              <Sparkles className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-foreground/70">
              No conversations yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Start a new chat to begin
            </p>
          </div>
        )}
      </ScrollArea>

      {/* Footer - User section */}
      <div className="p-3 border-t border-border/30">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full gap-3 h-12 px-3 rounded-xl justify-start hover:bg-secondary"
              >
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shrink-0 shadow-sm">
                  <span className="text-sm font-bold text-primary-foreground">
                    {(user.user_metadata?.display_name || user.email || "U")[0].toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-foreground truncate">
                  {user.user_metadata?.display_name || user.email?.split('@')[0]}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="start"
              side="top"
              className="w-56 mb-2 rounded-xl"
            >
              <DropdownMenuItem onClick={onOpenSettings} className="rounded-lg">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onSignOut}
                className="text-destructive focus:text-destructive rounded-lg"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="ghost"
            onClick={() => navigate("/auth")}
            className="w-full gap-3 h-12 px-3 rounded-xl justify-start text-muted-foreground hover:text-foreground hover:bg-secondary"
          >
            <LogIn className="h-4 w-4" />
            <span className="font-medium">Sign in</span>
          </Button>
        )}
      </div>
    </div>
  );
}

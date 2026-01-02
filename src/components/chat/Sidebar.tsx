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
  MoreHorizontal,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Conversation } from "@/types/chat";
import lumoraLogo from "@/assets/lumora-logo.png";
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
  isCollapsed: boolean;
  onToggleCollapse: () => void;
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
  isCollapsed,
  onToggleCollapse,
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
        {!isCollapsed && (
          <p className="text-xs font-medium text-muted-foreground/70 px-3 py-2 uppercase tracking-wider">
            {title}
          </p>
        )}
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
              {!isCollapsed ? (
                <span className="truncate text-sm font-normal">
                  {conversation.title}
                </span>
              ) : (
                <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
              )}
            </Button>
            {hoveredId === conversation.id && !isCollapsed && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover:bg-muted"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem>
                      <Pencil className="h-4 w-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conversation.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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
        {!isCollapsed && (
          <Button
            onClick={onNewChat}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* New Chat Button - Only when collapsed */}
      {isCollapsed && (
        <div className="p-2">
          <Button
            onClick={onNewChat}
            variant="ghost"
            size="icon"
            className="w-full h-10 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Conversations List */}
      <ScrollArea className="flex-1 px-1">
        {!isCollapsed && (
          <div className="px-2 py-3">
            <Button
              onClick={onNewChat}
              variant="ghost"
              className="w-full justify-start gap-3 h-10 px-3 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Plus className="h-4 w-4" />
              <span className="text-sm">New chat</span>
            </Button>
          </div>
        )}
        
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
      <div className="p-2 border-t border-sidebar-border">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full gap-3 h-12 px-3 rounded-lg justify-start hover:bg-sidebar-accent",
                  isCollapsed && "justify-center px-0"
                )}
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/60 to-primary flex items-center justify-center shrink-0">
                  <span className="text-sm font-medium text-primary-foreground">
                    {(user.user_metadata?.display_name || user.email || "U")[0].toUpperCase()}
                  </span>
                </div>
                {!isCollapsed && (
                  <span className="text-sm text-sidebar-foreground truncate">
                    {user.user_metadata?.display_name || user.email?.split('@')[0]}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align={isCollapsed ? "center" : "start"} 
              side="top"
              className="w-56 mb-2"
            >
              <DropdownMenuItem onClick={onOpenSettings}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onSignOut}
                className="text-destructive focus:text-destructive"
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
            className={cn(
              "w-full gap-3 h-12 px-3 rounded-lg justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
              isCollapsed && "justify-center px-0"
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

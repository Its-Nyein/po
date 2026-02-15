import { useConversations } from "@/api/queries/message.queries";
import { TronReticle } from "@/components/tron/TronReticle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Conversation } from "@/types/message";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MessagesPage() {
  const { data: conversations, isLoading } = useConversations();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <TronReticle size="lg" />
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
        <MessageCircle className="size-12 text-primary/30" />
        <p>No conversations yet.</p>
        <p className="text-sm">
          Follow someone and have them follow you back to start messaging.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {conversations.map((conv: Conversation) => (
        <button
          key={conv.id}
          onClick={() => navigate(`/messages/${conv.id}`)}
          className="flex items-center gap-3 p-3 rounded-md hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all text-left w-full"
        >
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback>{conv.otherUser.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-primary truncate">
                {conv.otherUser.name}
              </span>
              <span className="text-xs text-muted-foreground">
                @{conv.otherUser.username}
              </span>
            </div>
            {conv.lastMessage && (
              <p className="text-sm text-muted-foreground truncate">
                {conv.lastMessage}
              </p>
            )}
          </div>
          {conv.unreadCount > 0 && (
            <Badge variant="destructive" className="shrink-0">
              {conv.unreadCount}
            </Badge>
          )}
        </button>
      ))}
    </div>
  );
}

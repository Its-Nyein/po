import {
  useConversations,
  useMarkRead,
  useMessages,
  useSendMessage,
} from "@/api/queries/message.queries";
import { TronReticle } from "@/components/tron/TronReticle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWebSocketContext } from "@/contexts/websocket-context";
import { useAuth } from "@/lib/use-auth";
import type { Message } from "@/types/message";
import { Send } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

export default function ChatPage() {
  const { id } = useParams();
  const conversationId = Number(id);
  const { user } = useAuth();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMessages(conversationId);
  const { data: conversations } = useConversations();
  const sendMessage = useSendMessage();
  const markRead = useMarkRead();

  const conversation = useMemo(
    () => conversations?.find((c) => c.id === conversationId),
    [conversations, conversationId],
  );

  const recipientId = useMemo(() => {
    if (conversation?.otherUser?.id) return conversation.otherUser.id;
    const allMessages = data?.pages.flatMap((page) => page) ?? [];
    const otherMsg = allMessages.find((m) => m.senderId !== user?.id);
    return otherMsg?.senderId ?? 0;
  }, [conversation, data, user?.id]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { typingUsers, sendTyping } = useWebSocketContext();
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const messages = data?.pages.flatMap((page) => page).reverse() ?? [];

  useEffect(() => {
    if (conversationId) {
      markRead.mutate(conversationId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    if (container.scrollTop < 100 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSend = () => {
    const content = input.trim();
    if (!content) return;
    sendMessage.mutate({ conversationId, content });
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (!typingTimeoutRef.current && recipientId) {
      sendTyping(conversationId, recipientId);
      typingTimeoutRef.current = setTimeout(() => {
        typingTimeoutRef.current = undefined;
      }, 2000);
    }
  };

  const typingInConversation = typingUsers[conversationId];
  const isOtherTyping =
    typingInConversation && typingInConversation !== user?.id;

  useEffect(() => {
    console.log(
      "[Chat] typingUsers:",
      typingUsers,
      "conversationId:",
      conversationId,
      "isOtherTyping:",
      isOtherTyping,
    );
  }, [typingUsers, conversationId, isOtherTyping]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <TronReticle size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] md:h-[calc(100vh-10rem)]">
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-3 space-y-3"
      >
        {isFetchingNextPage && (
          <div className="flex justify-center py-2">
            <TronReticle size="sm" />
          </div>
        )}

        {messages.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No messages yet. Say hello!
          </p>
        )}

        {messages.map((msg: Message) => {
          const isOwn = msg.senderId === user?.id;
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${isOwn ? "justify-end" : "justify-start"}`}
            >
              {!isOwn && (
                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarFallback className="text-xs">
                    {msg.sender?.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                  isOwn
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {msg.content}
                <div
                  className={`text-[10px] mt-1 ${
                    isOwn
                      ? "text-primary-foreground/60"
                      : "text-muted-foreground"
                  }`}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {isOtherTyping && (
          <div className="flex items-end gap-2 justify-start">
            <Avatar className="h-7 w-7 shrink-0">
              <AvatarFallback className="text-xs">
                {conversation?.otherUser?.name?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="bg-muted rounded-lg px-4 py-3 flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
              <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
              <span className="size-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-primary/20 p-3 flex gap-2">
        <Input
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button
          onClick={handleSend}
          disabled={!input.trim() || sendMessage.isPending}
          size="icon"
        >
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
}

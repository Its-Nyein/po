import type { User } from "./user";

export interface Conversation {
  id: number;
  otherUser: User;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  sender: User;
  createdAt: string;
}

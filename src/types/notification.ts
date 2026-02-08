import type { User } from "./user";

export interface Notification {
  id: number;
  type: "like" | "comment" | "follow" | "quote" | "mention";
  content: string;
  userId: number;
  actorId: number;
  postId: number | null;
  read: boolean;
  actor: User;
  createdAt: string;
}

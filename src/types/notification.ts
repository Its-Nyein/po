import type { User } from "./user";

export interface Notification {
  id: number;
  type: "like" | "comment";
  content: string;
  userId: number;
  postId: number;
  read: boolean;
  user: User;
  createdAt: string;
}

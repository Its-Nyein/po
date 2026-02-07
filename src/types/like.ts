import type { User } from "./user";

export interface PostLike {
  id: number;
  postId: number;
  userId: number;
  user?: User;
  createdAt: string;
}

export interface CommentLike {
  id: number;
  commentId: number;
  userId: number;
  user?: User;
  createdAt: string;
}

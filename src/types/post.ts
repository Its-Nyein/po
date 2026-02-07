import type { User } from "./user";
import type { PostLike, CommentLike } from "./like";

export interface Post {
  id: number;
  content: string;
  userId: number;
  user: User;
  comments?: Comment[];
  likes?: PostLike[];
  createdAt: string;
}

export interface Comment {
  id: number;
  content: string;
  userId: number;
  postId: number;
  user: User;
  likes?: CommentLike[];
  createdAt: string;
}

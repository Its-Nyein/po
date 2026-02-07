import type { Post } from "./post";

export interface Bookmark {
  id: number;
  postId: number;
  userId: number;
  post: Post;
  createdAt: string;
}

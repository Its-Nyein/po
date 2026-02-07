import { apiClient } from "@/lib/api-client";

export const commentService = {
  create: (content: string, postId: number) =>
    apiClient.post("/content/comments", { content, postId }),
  delete: (id: number) => apiClient.delete(`/content/comments/${id}`),
};

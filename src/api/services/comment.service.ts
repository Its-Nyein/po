import { apiClient } from "@/lib/api-client";

export const commentService = {
  create: (content: string, postId: number) =>
    apiClient.post("/content/comments", { content, postId }),
  update: (id: number, content: string) =>
    apiClient.put(`/content/comments/${id}`, { content }),
  delete: (id: number) => apiClient.delete(`/content/comments/${id}`),
};

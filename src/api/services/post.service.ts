import { apiClient } from "@/lib/api-client";

export const postService = {
  getAll: () => apiClient.get("/content/posts"),
  getById: (id: number) => apiClient.get(`/content/posts/${id}`),
  create: (content: string) => apiClient.post("/content/posts", { content }),
  update: (id: number, content: string) =>
    apiClient.put(`/content/posts/${id}`, { content }),
  delete: (id: number) => apiClient.delete(`/content/posts/${id}`),
  getFollowing: () => apiClient.get("/content/following/posts"),
};

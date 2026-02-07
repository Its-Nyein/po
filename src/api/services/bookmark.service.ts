import { apiClient } from "@/lib/api-client";

export const bookmarkService = {
  getAll: () => apiClient.get("/content/bookmarks"),
  create: (postId: number) => apiClient.post(`/content/bookmarks/${postId}`),
  delete: (postId: number) => apiClient.delete(`/content/bookmarks/${postId}`),
};

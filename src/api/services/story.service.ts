import { apiClient } from "@/lib/api-client";

export const storyService = {
  getFeed: () => apiClient.get("/content/stories/feed"),
  getUserStories: (userId: number) =>
    apiClient.get(`/content/stories/user/${userId}`),
  create: (content: string, privacy: string) =>
    apiClient.post("/content/stories", { content, privacy }),
  delete: (id: number) => apiClient.delete(`/content/stories/${id}`),
  markViewed: (id: number) => apiClient.post(`/content/stories/${id}/view`),
  getViewers: (id: number) => apiClient.get(`/content/stories/${id}/viewers`),
};

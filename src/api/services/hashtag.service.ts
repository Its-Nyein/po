import { apiClient } from "@/lib/api-client";

export const hashtagService = {
  getPostsByHashtag: (tag: string) =>
    apiClient.get(`/content/hashtags/${tag}/posts`),
  getTrending: () => apiClient.get("/content/hashtags/trending"),
};

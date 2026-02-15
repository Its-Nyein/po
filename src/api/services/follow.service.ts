import { apiClient } from "@/lib/api-client";

export const followService = {
  follow: (id: number) => apiClient.post(`/follow/${id}`),
  unfollow: (id: number) => apiClient.delete(`/unfollow/${id}`),
  getFollowingUsers: () => apiClient.get("/following/users"),
  getFollowers: (id: number) => apiClient.get(`/users/${id}/followers`),
  getFollowing: (id: number) => apiClient.get(`/users/${id}/following`),
};

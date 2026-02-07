import { apiClient } from "@/lib/api-client";

export const followService = {
  follow: (id: number) => apiClient.post(`/follow/${id}`),
  unfollow: (id: number) => apiClient.delete(`/unfollow/${id}`),
};

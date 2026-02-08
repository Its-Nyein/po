import { apiClient } from "@/lib/api-client";

export const userService = {
  getAll: () => apiClient.get("/users"),
  getById: (id: number) => apiClient.get(`/users/${id}`),
  getByUsername: (username: string) =>
    apiClient.get(`/users/username/${username}`),
  search: (q: string) => apiClient.get(`/search?q=${q}`),
};

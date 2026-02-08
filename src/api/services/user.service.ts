import { apiClient } from "@/lib/api-client";

export const userService = {
  getAll: () => apiClient.get("/users"),
  getById: (id: number) => apiClient.get(`/users/${id}`),
  getByUsername: (username: string) =>
    apiClient.get(`/users/username/${username}`),
  search: (q: string) => apiClient.get(`/search?q=${q}`),
  updateProfile: (data: { name: string; username: string; bio: string }) =>
    apiClient.put("/users/profile", data),
  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    apiClient.put("/users/password", data),
  deleteAccount: () => apiClient.delete("/users/account"),
};

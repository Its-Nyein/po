import { apiClient } from "@/lib/api-client";

export const notificationService = {
  getAll: () => apiClient.get("/content/notis"),
  markAllRead: () => apiClient.put("/content/notis/read"),
  markOneRead: (id: number) => apiClient.put(`/content/notis/read/${id}`),
};

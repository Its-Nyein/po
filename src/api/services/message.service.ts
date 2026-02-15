import { apiClient } from "@/lib/api-client";

export const messageService = {
  getConversations: () => apiClient.get("/content/conversations"),
  createConversation: (userId: number) =>
    apiClient.post("/content/conversations", { userId }),
  getMessages: (id: number, cursor?: number) =>
    apiClient.get(`/content/conversations/${id}/messages`, {
      params: cursor ? { cursor } : undefined,
    }),
  sendMessage: (id: number, content: string) =>
    apiClient.post(`/content/conversations/${id}/messages`, { content }),
  markRead: (id: number) => apiClient.put(`/content/conversations/${id}/read`),
  getUnreadCount: () => apiClient.get("/content/conversations/unread"),
  canMessage: (userId: number) =>
    apiClient.get(`/content/conversations/can-message/${userId}`),
};

import { apiClient } from "@/lib/api-client";

export const likeService = {
  likePost: (id: number) => apiClient.post(`/content/like/posts/${id}`),
  unlikePost: (id: number) => apiClient.delete(`/content/unlike/posts/${id}`),
  likeComment: (id: number) => apiClient.post(`/content/like/comments/${id}`),
  unlikeComment: (id: number) =>
    apiClient.delete(`/content/unlike/comments/${id}`),
  getPostLikers: (id: number) => apiClient.get(`/content/likes/posts/${id}`),
  getCommentLikers: (id: number) =>
    apiClient.get(`/content/likes/comments/${id}`),
};

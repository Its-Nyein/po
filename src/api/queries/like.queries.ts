import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { likeService } from "../services/like.service";

export function useLikePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => likeService.likePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
}

export function useUnlikePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => likeService.unlikePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
}

export function useLikeComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => likeService.likeComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
}

export function useUnlikeComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => likeService.unlikeComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
}

export function usePostLikers(id: number, type: string) {
  return useQuery({
    queryKey: ["users", id, type],
    queryFn: async () => {
      const res =
        type === "comment"
          ? await likeService.getCommentLikers(id)
          : await likeService.getPostLikers(id);
      return res.data;
    },
  });
}

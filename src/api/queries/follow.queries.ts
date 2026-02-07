import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followService } from "../services/follow.service";

export function useFollow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => followService.follow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["search"] });
    },
  });
}

export function useUnfollow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => followService.unfollow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["search"] });
    },
  });
}

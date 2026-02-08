import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { followService } from "../services/follow.service";

export function useFollow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => followService.follow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["search"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
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
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useFollowingUsers() {
  return useQuery({
    queryKey: ["following", "users"],
    queryFn: () => followService.getFollowingUsers().then((res) => res.data),
  });
}

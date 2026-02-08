import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postService } from "../services/post.service";

export function usePosts(showLatest: boolean) {
  return useQuery({
    queryKey: ["posts", showLatest],
    queryFn: async () => {
      const res = showLatest
        ? await postService.getAll()
        : await postService.getFollowing();
      return res.data;
    },
  });
}

export function usePost(id: number) {
  return useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      const res = await postService.getById(id);
      return res.data;
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      content,
      quotedPostId,
    }: {
      content: string;
      quotedPostId?: number;
    }) => postService.create(content, quotedPostId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, content }: { id: number; content: string }) =>
      postService.update(id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => postService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

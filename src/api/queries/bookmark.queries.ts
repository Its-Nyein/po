import type { Bookmark } from "@/types/bookmark";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookmarkService } from "../services/bookmark.service";

export function useBookmarks() {
  return useQuery<Bookmark[]>({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      const res = await bookmarkService.getAll();
      return res.data;
    },
  });
}

export function useCreateBookmark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: number) => bookmarkService.create(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });
}

export function useDeleteBookmark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: number) => bookmarkService.delete(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });
}

import { storyService } from "@/api/services/story.service";
import type { Story, StoryView } from "@/types/story";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useStoryFeed() {
  return useQuery<Story[]>({
    queryKey: ["stories"],
    queryFn: async () => {
      const res = await storyService.getFeed();
      return res.data;
    },
  });
}

export function useUserStories(userId: number) {
  return useQuery<Story[]>({
    queryKey: ["stories", "user", userId],
    queryFn: async () => {
      const res = await storyService.getUserStories(userId);
      return res.data;
    },
  });
}

export function useCreateStory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ content, privacy }: { content: string; privacy: string }) =>
      storyService.create(content, privacy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });
}

export function useDeleteStory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => storyService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });
}

export function useMarkStoryViewed() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => storyService.markViewed(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });
}

export function useStoryViewers(storyId: number) {
  return useQuery<StoryView[]>({
    queryKey: ["stories", "viewers", storyId],
    queryFn: async () => {
      const res = await storyService.getViewers(storyId);
      return res.data;
    },
    enabled: storyId > 0,
  });
}

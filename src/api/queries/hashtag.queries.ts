import { useQuery } from "@tanstack/react-query";
import { hashtagService } from "../services/hashtag.service";

export function useHashtagPosts(tag: string) {
  return useQuery({
    queryKey: ["posts", "hashtag", tag],
    queryFn: async () => {
      const res = await hashtagService.getPostsByHashtag(tag);
      return res.data;
    },
    enabled: tag.length > 0,
  });
}

export function useTrendingHashtags() {
  return useQuery({
    queryKey: ["hashtags", "trending"],
    queryFn: async () => {
      const res = await hashtagService.getTrending();
      return res.data;
    },
  });
}

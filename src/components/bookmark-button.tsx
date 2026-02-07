import {
  useBookmarks,
  useCreateBookmark,
  useDeleteBookmark,
} from "@/api/queries/bookmark.queries";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/use-auth";
import { Bookmark } from "lucide-react";

interface BookmarkButtonProps {
  postId: number;
}

export function BookmarkButton({ postId }: BookmarkButtonProps) {
  const { user } = useAuth();
  const { data: bookmarks } = useBookmarks();
  const createBookmark = useCreateBookmark();
  const deleteBookmark = useDeleteBookmark();

  const isBookmarked = bookmarks?.some((b) => b.postId === postId);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    if (isBookmarked) {
      deleteBookmark.mutate(postId);
    } else {
      createBookmark.mutate(postId);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7"
      onClick={handleToggle}
    >
      <Bookmark
        className={`h-4 w-4 ${isBookmarked ? "fill-primary text-primary" : "text-primary/70"}`}
      />
    </Button>
  );
}

import { useBookmarks } from "@/api/queries/bookmark.queries";
import { useDeletePost, useUpdatePost } from "@/api/queries/post.queries";
import { PostCard } from "@/components/post-card";
import { TronReticle } from "@/components/tron/TronReticle";
import type { Bookmark } from "@/types/bookmark";
import { toast } from "sonner";

export default function BookmarksPage() {
  const { data, isLoading, isError, error } = useBookmarks();
  const deletePost = useDeletePost();
  const updatePost = useUpdatePost();

  const handleDelete = (id: number) => {
    deletePost.mutate(id, {
      onSuccess: () => toast.success("Post deleted"),
    });
  };

  const handleEdit = (id: number, content: string) => {
    updatePost.mutate(
      { id, content },
      { onSuccess: () => toast.success("Post updated") },
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <TronReticle size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-destructive">{(error as Error).message}</p>
    );
  }

  return (
    <div>
      {(data as Bookmark[])?.map((bookmark) => (
        <PostCard
          key={bookmark.id}
          item={bookmark.post}
          remove={handleDelete}
          onEdit={handleEdit}
        />
      ))}

      {data?.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No bookmarks yet. Save posts to find them here later!
        </p>
      )}
    </div>
  );
}

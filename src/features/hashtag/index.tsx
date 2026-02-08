import { useHashtagPosts } from "@/api/queries/hashtag.queries";
import { useDeletePost, useUpdatePost } from "@/api/queries/post.queries";
import { PostCard } from "@/components/post-card";
import { TronReticle } from "@/components/tron/TronReticle";
import type { Post } from "@/types/post";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export default function HashtagPage() {
  const { tag } = useParams<{ tag: string }>();
  const { data, isLoading, isError, error } = useHashtagPosts(tag || "");
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
      <h2 className="text-xl font-bold mb-4 text-primary">#{tag}</h2>

      {(data as Post[])?.map((post: Post) => (
        <PostCard
          key={post.id}
          item={post}
          remove={handleDelete}
          onEdit={handleEdit}
        />
      ))}

      {data?.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No posts with this hashtag yet.
        </p>
      )}
    </div>
  );
}

import {
  useDeletePost,
  usePosts,
  useUpdatePost,
} from "@/api/queries/post.queries";
import { PostCard } from "@/components/post-card";
import { PostForm } from "@/components/post-form";
import { TronReticle } from "@/components/tron/TronReticle";
import { Button } from "@/components/ui/button";
import type { Post } from "@/types/post";
import { useState } from "react";
import { toast } from "sonner";

export default function FeedPage() {
  const [showLatest, setShowLatest] = useState(true);
  const { data, isLoading, isError, error } = usePosts(showLatest);
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
      <PostForm />

      <div className="flex items-center justify-center gap-2 mb-4">
        <Button
          variant={showLatest ? "default" : "outline"}
          size="sm"
          onClick={() => setShowLatest(true)}
        >
          All Posts
        </Button>
        <span className="text-primary/50">|</span>
        <Button
          variant={!showLatest ? "default" : "outline"}
          size="sm"
          onClick={() => setShowLatest(false)}
        >
          Following
        </Button>
      </div>

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
          No posts yet. Be the first to post!
        </p>
      )}
    </div>
  );
}

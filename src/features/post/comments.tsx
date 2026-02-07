import { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePost, useDeletePost } from "@/api/queries/post.queries";
import {
  useCreateComment,
  useDeleteComment,
} from "@/api/queries/comment.queries";
import { PostCard } from "@/components/post-card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TronReticle } from "@/components/tron/TronReticle";
import { toast } from "sonner";
import type { Comment } from "@/types/post";

export default function CommentsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const { data, isLoading, isError, error } = usePost(Number(id));
  const createComment = useCreateComment();
  const deleteComment = useDeleteComment();
  const deletePost = useDeletePost();

  const handleDeletePost = (postId: number) => {
    deletePost.mutate(postId, {
      onSuccess: () => {
        toast.success("Post deleted");
        navigate("/");
      },
    });
  };

  const handleDeleteComment = (commentId: number) => {
    deleteComment.mutate(commentId, {
      onSuccess: () => toast.success("Comment deleted"),
    });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    const content = contentRef.current?.value;
    if (!content) return;

    createComment.mutate(
      { content, postId: Number(id) },
      {
        onSuccess: () => {
          toast.success("Comment added");
          if (contentRef.current) contentRef.current.value = "";
        },
      },
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
      <PostCard item={data} primary remove={handleDeletePost} />

      {data?.comments?.map((comment: Comment) => (
        <PostCard
          key={comment.id}
          item={comment}
          comment
          remove={handleDeleteComment}
        />
      ))}

      <form onSubmit={handleAddComment} className="mt-4 space-y-2">
        <Textarea ref={contentRef} placeholder="Your comment" />
        <Button type="submit" disabled={createComment.isPending}>
          Reply
        </Button>
      </form>
    </div>
  );
}

import {
  useCreateComment,
  useDeleteComment,
  useUpdateComment,
} from "@/api/queries/comment.queries";
import {
  useDeletePost,
  usePost,
  useUpdatePost,
} from "@/api/queries/post.queries";
import { PostCard } from "@/components/post-card";
import { TronReticle } from "@/components/tron/TronReticle";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Comment } from "@/types/post";
import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function CommentsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const { data, isLoading, isError, error } = usePost(Number(id));
  const createComment = useCreateComment();
  const deleteComment = useDeleteComment();
  const updateComment = useUpdateComment();
  const deletePost = useDeletePost();
  const updatePost = useUpdatePost();

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

  const handleEditPost = (postId: number, content: string) => {
    updatePost.mutate(
      { id: postId, content },
      { onSuccess: () => toast.success("Post updated") },
    );
  };

  const handleEditComment = (commentId: number, content: string) => {
    updateComment.mutate(
      { id: commentId, content },
      { onSuccess: () => toast.success("Comment updated") },
    );
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
      <PostCard
        item={data}
        primary
        remove={handleDeletePost}
        onEdit={handleEditPost}
      />

      {data?.comments?.map((comment: Comment) => (
        <PostCard
          key={comment.id}
          item={comment}
          comment
          remove={handleDeleteComment}
          onEdit={handleEditComment}
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

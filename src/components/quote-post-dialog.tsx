import { useCreatePost } from "@/api/queries/post.queries";
import { MentionTextarea } from "@/components/mention-textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Post } from "@/types/post";
import { useRef } from "react";
import { toast } from "sonner";
import { EmbeddedPost } from "./embedded-post";

interface QuotePostDialogProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuotePostDialog({
  post,
  open,
  onOpenChange,
}: QuotePostDialogProps) {
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const createPost = useCreatePost();

  const handleSubmit = () => {
    const content = contentRef.current?.value ?? "";

    createPost.mutate(
      { content, quotedPostId: post.id },
      {
        onSuccess: () => {
          toast.success("Quote post created");
          onOpenChange(false);
        },
        onError: () => {
          toast.error("Failed to create quote post");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Quote Post</DialogTitle>
        </DialogHeader>
        <MentionTextarea
          ref={contentRef}
          placeholder="Add your commentary..."
          className="min-h-[80px]"
        />
        <EmbeddedPost post={post} />
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={createPost.isPending}>
            Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

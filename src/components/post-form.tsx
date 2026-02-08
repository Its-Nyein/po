import { useRef } from "react";
import { MentionTextarea } from "@/components/mention-textarea";
import { Button } from "@/components/ui/button";
import { useCreatePost } from "@/api/queries/post.queries";
import { toast } from "sonner";

export function PostForm() {
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const createPost = useCreatePost();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const content = contentRef.current?.value;
    if (!content) return;

    createPost.mutate(
      { content },
      {
        onSuccess: () => {
          toast.success("Post created");
          if (contentRef.current) contentRef.current.value = "";
        },
        onError: () => {
          toast.error("Failed to create post");
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <MentionTextarea
        ref={contentRef}
        placeholder="What's on your mind?"
        className="mb-2"
      />
      <div className="text-right">
        <Button type="submit" disabled={createPost.isPending}>
          Post
        </Button>
      </div>
    </form>
  );
}

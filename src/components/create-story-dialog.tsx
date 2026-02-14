import { useCreateStory } from "@/api/queries/story.queries";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface CreateStoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateStoryDialog({
  open,
  onOpenChange,
}: CreateStoryDialogProps) {
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [privacy, setPrivacy] = useState<string>("public");
  const createStory = useCreateStory();

  const handleSubmit = () => {
    const content = contentRef.current?.value?.trim();
    if (!content) return;

    createStory.mutate(
      { content, privacy },
      {
        onSuccess: () => {
          toast.success("Story created");
          onOpenChange(false);
          if (contentRef.current) contentRef.current.value = "";
          setPrivacy("public");
        },
        onError: () => {
          toast.error("Failed to create story");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Create Story</DialogTitle>
        </DialogHeader>
        <Textarea
          ref={contentRef}
          placeholder="What's on your mind?"
          className="min-h-[100px]"
          maxLength={500}
        />
        <div className="flex gap-2">
          {(["public", "friends", "private"] as const).map((p) => (
            <Button
              key={p}
              variant={privacy === p ? "default" : "outline"}
              size="sm"
              onClick={() => setPrivacy(p)}
              className="capitalize"
            >
              {p}
            </Button>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={createStory.isPending}>
            Share Story
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

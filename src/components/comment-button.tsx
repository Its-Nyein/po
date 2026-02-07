import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import type { Post } from "@/types/post";

interface CommentButtonProps {
  item: Post;
}

export function CommentButton({ item }: CommentButtonProps) {
  return (
    <div className="flex items-center">
      <Button variant="ghost" size="icon" className="h-7 w-7">
        <MessageCircle className="h-4 w-4 text-primary/70" />
      </Button>
      <span className="text-xs text-muted-foreground">
        {item.comments?.length ?? 0}
      </span>
    </div>
  );
}

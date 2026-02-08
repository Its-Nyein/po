import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/use-auth";
import type { Post } from "@/types/post";
import { Repeat2 } from "lucide-react";
import { useState } from "react";
import { QuotePostDialog } from "./quote-post-dialog";

interface RepostButtonProps {
  item: Post;
}

export function RepostButton({ item }: RepostButtonProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    setOpen(true);
  };

  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={handleClick}
      >
        <Repeat2 className="h-4 w-4 text-green-400/70" />
      </Button>
      <span className="text-xs text-muted-foreground px-1">
        {item.quoteCount ?? 0}
      </span>
      <QuotePostDialog post={item} open={open} onOpenChange={setOpen} />
    </div>
  );
}

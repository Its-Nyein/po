import { Card, CardContent } from "@/components/ui/card";
import type { Post } from "@/types/post";
import { formatRelative } from "date-fns";
import { Clock, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RichContent } from "./rich-content";

interface EmbeddedPostProps {
  post: Post;
}

export function EmbeddedPost({ post }: EmbeddedPostProps) {
  const navigate = useNavigate();

  return (
    <Card
      className="border-primary/30 bg-muted/30 cursor-pointer hover:border-primary/50 transition-all"
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/comments/${post.id}`);
      }}
    >
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <UserCircle className="w-3.5 h-3.5 text-primary/70" />
          <span className="text-xs font-medium">{post.user?.name}</span>
          <div className="flex items-center gap-1 text-xs text-primary/50">
            <Clock className="w-2.5 h-2.5" />
            <span>{formatRelative(new Date(post.createdAt), new Date())}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">
          <RichContent content={post.content} />
        </p>
      </CardContent>
    </Card>
  );
}

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useAuth } from "@/lib/use-auth";
import { useNavigate } from "react-router-dom";
import {
  useLikePost,
  useUnlikePost,
  useLikeComment,
  useUnlikeComment,
} from "@/api/queries/like.queries";
import type { Post, Comment } from "@/types/post";

interface LikeButtonProps {
  item: Post | Comment;
  comment?: boolean;
}

export function LikeButton({ item, comment }: LikeButtonProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const likePost = useLikePost();
  const unlikePost = useUnlikePost();
  const likeComment = useLikeComment();
  const unlikeComment = useUnlikeComment();

  const isLiked = user && item.likes?.some((l) => l.userId === user.id);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    if (isLiked) {
      if (comment) unlikeComment.mutate(item.id);
      else unlikePost.mutate(item.id);
    } else {
      if (comment) likeComment.mutate(item.id);
      else likePost.mutate(item.id);
    }
  };

  const handleNavigate = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/likes/${item.id}/${comment ? "comment" : "post"}`);
  };

  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={handleLike}
      >
        <Heart
          className={`h-4 w-4 ${isLiked ? "fill-destructive text-destructive" : "text-destructive/70"}`}
        />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-1 text-xs text-muted-foreground"
        onClick={handleNavigate}
      >
        {item.likes?.length ?? 0}
      </Button>
    </div>
  );
}

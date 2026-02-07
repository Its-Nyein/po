import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Clock, UserCircle } from "lucide-react";
import { formatRelative } from "date-fns";
import { useNavigate } from "react-router-dom";
import { LikeButton } from "./like-button";
import { CommentButton } from "./comment-button";
import { useAuth } from "@/lib/use-auth";
import type { Post, Comment } from "@/types/post";

interface PostCardProps {
  item: Post | Comment;
  remove?: (id: number) => void;
  primary?: boolean;
  comment?: boolean;
}

export function PostCard({ item, remove, primary, comment }: PostCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isOwner = user?.id === item.userId;

  return (
    <Card className="mb-3 tron-corners border-primary/20 hover:border-primary/40 transition-all">
      {primary && <div className="h-1 bg-primary/50 rounded-t-sm" />}
      <CardContent
        className="p-4 cursor-pointer"
        onClick={() => {
          if (!comment) navigate(`/comments/${item.id}`);
        }}
      >
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-1.5 text-xs text-primary/70">
            <Clock className="w-3 h-3" />
            <span>{formatRelative(new Date(item.createdAt), new Date())}</span>
          </div>
          {isOwner && remove && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                remove(item.id);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        <p className="my-3 text-foreground">{item.content}</p>

        <div className="flex justify-between items-center">
          <div
            className="flex items-center gap-1.5 cursor-pointer hover:text-primary transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/profile/${item.user.id}`);
            }}
          >
            <UserCircle className="w-4 h-4 text-primary/70" />
            <span className="text-sm">{item.user.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <LikeButton item={item} comment={comment} />
            {!comment && <CommentButton item={item as Post} />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/use-auth";
import type { Comment, Post } from "@/types/post";
import { formatRelative } from "date-fns";
import { Clock, Pencil, Trash2, UserCircle } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookmarkButton } from "./bookmark-button";
import { CommentButton } from "./comment-button";
import { LikeButton } from "./like-button";

interface PostCardProps {
  item: Post | Comment;
  remove?: (id: number) => void;
  onEdit?: (id: number, content: string) => void;
  primary?: boolean;
  comment?: boolean;
}

export function PostCard({
  item,
  remove,
  onEdit,
  primary,
  comment,
}: PostCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const editRef = useRef<HTMLTextAreaElement>(null);

  const isOwner = user?.id === item.userId;

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const content = editRef.current?.value;
    if (!content || !onEdit) return;
    onEdit(item.id, content);
    setIsEditing(false);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(false);
  };

  return (
    <Card className="mb-3 tron-corners border-primary/20 hover:border-primary/40 transition-all">
      {primary && <div className="h-1 bg-primary/50 rounded-t-sm" />}
      <CardContent
        className="p-4 cursor-pointer"
        onClick={() => {
          if (!comment && !isEditing) navigate(`/comments/${item.id}`);
        }}
      >
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-1.5 text-xs text-primary/70">
            <Clock className="w-3 h-3" />
            <span>{formatRelative(new Date(item.createdAt), new Date())}</span>
          </div>
          <div className="flex items-center gap-1">
            {isOwner && onEdit && !isEditing && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            )}
            {isOwner && remove && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Delete {comment ? "comment" : "post"}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your {comment ? "comment" : "post"}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      onClick={() => remove(item.id)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="my-3 space-y-2" onClick={(e) => e.stopPropagation()}>
            <Textarea ref={editRef} defaultValue={item.content} />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        ) : (
          <p className="my-3 text-foreground">{item.content}</p>
        )}

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
            {!comment && <BookmarkButton postId={item.id} />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

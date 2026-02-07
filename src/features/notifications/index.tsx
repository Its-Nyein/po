import {
  useMarkAllRead,
  useMarkOneRead,
  useNotifications,
} from "@/api/queries/notification.queries";
import { TronReticle } from "@/components/tron/TronReticle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Notification } from "@/types/notification";
import { format } from "date-fns";
import { Heart, MessageCircle, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const notiIcon = {
  like: <Heart className="w-5 h-5 text-destructive mt-0.5 shrink-0" />,
  comment: <MessageCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />,
  follow: <UserPlus className="w-5 h-5 text-primary mt-0.5 shrink-0" />,
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useNotifications();
  const markAllRead = useMarkAllRead();
  const markOneRead = useMarkOneRead();

  const handleClick = (noti: Notification) => {
    markOneRead.mutate(noti.id);
    if (noti.type === "follow") {
      navigate(`/profile/${noti.actorId}`);
    } else if (noti.postId) {
      navigate(`/comments/${noti.postId}`);
    }
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
      <div className="flex justify-end mb-3">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() => markAllRead.mutate()}
        >
          Mark all as read
        </Button>
      </div>

      {(data as Notification[])?.map((noti: Notification) => (
        <Card
          key={noti.id}
          className={`mb-2 cursor-pointer transition-all border-primary/20 hover:border-primary/40 ${
            noti.read ? "opacity-40" : ""
          }`}
          onClick={() => handleClick(noti)}
        >
          <CardContent className="flex items-start gap-3 p-4">
            {notiIcon[noti.type]}
            <div className="flex-1">
              <Avatar className="w-8 h-8 mb-1">
                <AvatarFallback>{noti.actor?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <p className="text-sm">{noti.content}</p>
              <p className="text-xs text-primary mt-1">
                {format(new Date(noti.createdAt), "MMM dd, yyyy")}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}

      {data?.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No notifications yet.
        </p>
      )}
    </div>
  );
}

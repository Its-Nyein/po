import { useFollow, useUnfollow } from "@/api/queries/follow.queries";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/use-auth";
import type { User } from "@/types/user";
import { toast } from "sonner";

interface FollowButtonProps {
  user: User;
}

export function FollowButton({ user: targetUser }: FollowButtonProps) {
  const { user: authUser } = useAuth();
  const follow = useFollow();
  const unfollow = useUnfollow();

  if (!authUser || authUser.id === targetUser.id) return null;

  const isFollowing = targetUser.followers?.some(
    (f) => f.followerId === authUser.id,
  );

  return (
    <Button
      size="sm"
      variant={isFollowing ? "outline" : "default"}
      className="rounded-full"
      onClick={(e) => {
        e.stopPropagation();
        if (isFollowing) {
          unfollow.mutate(targetUser.id, {
            onSuccess: () => toast.success(`Unfollowed ${targetUser.name}`),
          });
        } else {
          follow.mutate(targetUser.id, {
            onSuccess: () => toast.success(`Following ${targetUser.name}`),
          });
        }
      }}
    >
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
}

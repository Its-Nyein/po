import { useFollowers, useFollowing } from "@/api/queries/follow.queries";
import { TronReticle } from "@/components/tron/TronReticle";
import { UserList } from "@/components/user-list";
import type { User } from "@/types/user";
import { useLocation, useParams } from "react-router-dom";

export default function FollowListPage() {
  const { id } = useParams();
  const location = useLocation();
  const isFollowers = location.pathname.endsWith("/followers");

  const followers = useFollowers(Number(id));
  const following = useFollowing(Number(id));

  const { data, isLoading, isError, error } = isFollowers
    ? followers
    : following;

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

  const mappedData = data?.map((user: User) => ({ id: user.id, user })) || [];

  return (
    <UserList
      title={isFollowers ? "Followers" : "Following"}
      data={mappedData}
    />
  );
}

import { useParams } from "react-router-dom";
import { useUser } from "@/api/queries/user.queries";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FollowButton } from "@/components/follow-button";
import { TronReticle } from "@/components/tron/TronReticle";

export default function ProfilePage() {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useUser(Number(id));

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
      <div className="h-32 bg-primary/10 border border-primary/20 rounded-sm mb-[-40px]" />
      <div className="flex flex-col items-center gap-2 mb-6">
        <Avatar className="w-20 h-20 border-2 border-primary shadow-[0_0_15px_var(--tron-dim)]">
          <AvatarFallback className="text-2xl">
            {data?.name?.[0] || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h2 className="text-lg font-heading text-primary tracking-wider">
            {data?.name}
          </h2>
          <p className="text-sm text-muted-foreground">@{data?.username}</p>
          <p className="text-sm text-muted-foreground mt-1">{data?.bio}</p>
          <div className="flex gap-4 justify-center mt-2 text-sm">
            <span>
              <strong className="text-primary">
                {data?.followers?.length || 0}
              </strong>{" "}
              followers
            </span>
            <span>
              <strong className="text-primary">
                {data?.following?.length || 0}
              </strong>{" "}
              following
            </span>
          </div>
        </div>
        {data && <FollowButton user={data} />}
      </div>
    </div>
  );
}

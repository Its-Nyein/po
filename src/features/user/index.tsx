import { useUserByUsername } from "@/api/queries/user.queries";
import { TronReticle } from "@/components/tron/TronReticle";
import type { User } from "@/types/user";
import { Navigate, useParams } from "react-router-dom";

export default function UserByUsernamePage() {
  const { username } = useParams<{ username: string }>();
  const { data, isLoading, isError } = useUserByUsername(username || "");

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <TronReticle size="lg" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <p className="text-center text-muted-foreground py-8">User not found.</p>
    );
  }

  return <Navigate to={`/profile/${(data as User).id}`} replace />;
}

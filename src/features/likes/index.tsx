import { useParams } from "react-router-dom";
import { usePostLikers } from "@/api/queries/like.queries";
import { UserList } from "@/components/user-list";
import { TronReticle } from "@/components/tron/TronReticle";

export default function LikesPage() {
  const { id, type } = useParams();
  const { data, isLoading, isError, error } = usePostLikers(
    Number(id),
    type || "post",
  );

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

  return <UserList title="Likes" data={data || []} />;
}

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FollowButton } from "@/components/follow-button";
import { useSearch } from "@/api/queries/user.queries";
import { useNavigate } from "react-router-dom";
import { TronReticle } from "@/components/tron/TronReticle";
import type { User } from "@/types/user";

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { data, isLoading } = useSearch(query);

  return (
    <div>
      <Input
        placeholder="Search users..."
        className="mb-4"
        onChange={(e) => setQuery(e.target.value)}
      />

      {isLoading ? (
        <div className="flex justify-center py-8">
          <TronReticle />
        </div>
      ) : (
        <div className="space-y-2">
          {(data as User[])?.map((user: User) => (
            <div
              key={user.id}
              className="flex items-center gap-3 p-3 rounded-sm border border-primary/20 hover:border-primary/40 cursor-pointer transition-all"
              onClick={() => navigate(`/profile/${user.id}`)}
            >
              <Avatar>
                <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.bio}
                </p>
              </div>
              <FollowButton user={user} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

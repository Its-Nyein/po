import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FollowButton } from "./follow-button";
import { useNavigate } from "react-router-dom";
import type { User } from "@/types/user";

interface UserListProps {
  title: string;
  data: Array<{
    id: number;
    user: {
      id: number;
      name: string;
      bio: string;
      following?: Array<{ followerId: number }>;
    };
  }>;
}

export function UserList({ title, data }: UserListProps) {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="text-2xl font-heading text-primary tracking-wider text-center mb-4">
        {title}
      </h2>
      <div className="space-y-2">
        {data.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 rounded-sm border border-primary/20 hover:border-primary/40 cursor-pointer transition-all"
            onClick={() => navigate(`/profile/${item.user.id}`)}
          >
            <Avatar>
              <AvatarFallback>{item.user.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{item.user.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {item.user.bio}
              </p>
            </div>
            <FollowButton user={item.user as User} />
          </div>
        ))}
      </div>
    </div>
  );
}

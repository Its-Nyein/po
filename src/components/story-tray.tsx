import { useStoryFeed } from "@/api/queries/story.queries";
import { CreateStoryDialog } from "@/components/create-story-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/use-auth";
import type { Story, StoryTrayUser } from "@/types/story";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export function StoryTray() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: stories } = useStoryFeed();
  const [dialogOpen, setDialogOpen] = useState(false);

  const trayUsers = useMemo(() => {
    if (!stories || !user) return [];

    const grouped = new Map<number, StoryTrayUser>();

    for (const story of stories) {
      const existing = grouped.get(story.userId);
      if (existing) {
        existing.stories.push(story);
        if (!isViewed(story, user.id)) {
          existing.hasUnviewed = true;
        }
      } else {
        grouped.set(story.userId, {
          userId: story.userId,
          user: story.user,
          stories: [story],
          hasUnviewed: !isViewed(story, user.id),
        });
      }
    }

    // Sort: own stories first, then users with unviewed, then rest
    const result = Array.from(grouped.values());
    result.sort((a, b) => {
      if (a.userId === user.id) return -1;
      if (b.userId === user.id) return 1;
      if (a.hasUnviewed && !b.hasUnviewed) return -1;
      if (!a.hasUnviewed && b.hasUnviewed) return 1;
      return 0;
    });

    return result;
  }, [stories, user]);

  return (
    <>
      <div className="flex gap-3 overflow-x-auto p-3 mb-4 scrollbar-hide">
        <button
          onClick={() => setDialogOpen(true)}
          className="flex flex-col items-center gap-1 shrink-0"
        >
          <div className="w-14 h-14 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center hover:border-primary/70 transition-colors">
            <Plus className="w-5 h-5 text-primary/70" />
          </div>
          <span className="text-[10px] text-muted-foreground w-14 text-center truncate">
            Add Story
          </span>
        </button>

        {trayUsers.map((trayUser) => (
          <button
            key={trayUser.userId}
            onClick={() => navigate(`/stories/${trayUser.userId}`)}
            className="flex flex-col items-center gap-1 shrink-0"
          >
            <div
              className={`w-14 h-14 rounded-full p-[2px] ${
                trayUser.hasUnviewed
                  ? "bg-linear-to-tr from-primary via-primary/80 to-primary/50 shadow-[0_0_8px_rgba(0,212,255,0.4)]"
                  : "bg-muted-foreground/20"
              }`}
            >
              <Avatar className="w-full h-full border-2 border-background">
                <AvatarFallback
                  className={`text-sm ${trayUser.hasUnviewed ? "" : "opacity-50"}`}
                >
                  {trayUser.user?.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
            <span className="text-[10px] text-muted-foreground w-14 text-center truncate">
              {trayUser.userId === user?.id ? "You" : trayUser.user?.name}
            </span>
          </button>
        ))}
      </div>

      <CreateStoryDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}

function isViewed(story: Story, viewerId: number): boolean {
  return story.views?.some((v) => v.viewerId === viewerId) ?? false;
}

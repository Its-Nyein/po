import {
  useDeleteStory,
  useMarkStoryViewed,
  useStoryFeed,
  useStoryViewers,
  useUserStories,
} from "@/api/queries/story.queries";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/use-auth";
import type { Story } from "@/types/story";
import { formatDistanceToNow } from "date-fns";
import { ChevronDown, ChevronUp, Eye, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const STORY_DURATION = 5000;

export default function StoryViewerPage() {
  const { userId } = useParams();

  return <StoryViewerInner key={userId} userId={userId} />;
}

function StoryViewerInner({ userId }: { userId: string | undefined }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: feedStories } = useStoryFeed();
  const { data: userStories } = useUserStories(Number(userId));
  const markViewed = useMarkStoryViewed();
  const deleteStory = useDeleteStory();

  const [storyIndex, setStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showViewers, setShowViewers] = useState(false);
  const startTimeRef = useRef<number>(0);
  const markedViewRef = useRef<number | null>(null);

  const stories = userStories ?? [];
  const currentStory = stories[storyIndex] as Story | undefined;
  const isOwner = currentStory?.userId === user?.id;

  const orderedUserIds = useMemo(() => {
    if (!feedStories || !user) return [];
    const seen = new Set<number>();
    const ids: number[] = [];
    for (const s of feedStories) {
      if (!seen.has(s.userId)) {
        seen.add(s.userId);
        ids.push(s.userId);
      }
    }
    return ids;
  }, [feedStories, user]);

  const { data: viewers } = useStoryViewers(
    isOwner && showViewers && currentStory ? currentStory.id : 0,
  );

  useEffect(() => {
    if (!currentStory || !user || currentStory.userId === user.id) return;
    if (markedViewRef.current === currentStory.id) return;
    const alreadyViewed = currentStory.views?.some(
      (v) => v.viewerId === user.id,
    );
    if (!alreadyViewed) {
      markedViewRef.current = currentStory.id;
      markViewed.mutate(currentStory.id);
    }
  }, [currentStory, user, markViewed]);

  const goToNext = useCallback(() => {
    if (storyIndex < stories.length - 1) {
      setStoryIndex((i) => i + 1);
      setProgress(0);
      setShowViewers(false);
    } else {
      const currentIdx = orderedUserIds.indexOf(Number(userId));
      if (currentIdx >= 0 && currentIdx < orderedUserIds.length - 1) {
        navigate(`/stories/${orderedUserIds[currentIdx + 1]}`, {
          replace: true,
        });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [storyIndex, stories.length, orderedUserIds, userId, navigate]);

  const goToPrev = useCallback(() => {
    if (storyIndex > 0) {
      setStoryIndex((i) => i - 1);
      setProgress(0);
      setShowViewers(false);
    }
  }, [storyIndex]);

  const currentStoryId = currentStory?.id;
  useEffect(() => {
    if (showViewers || !currentStoryId) return;

    startTimeRef.current = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(elapsed / STORY_DURATION, 1);
      setProgress(pct);
      if (pct >= 1) {
        clearInterval(interval);
        goToNext();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [storyIndex, currentStoryId, showViewers, goToNext]);

  const handleTap = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const threshold = rect.width * 0.3;
    if (x < threshold) {
      goToPrev();
    } else {
      goToNext();
    }
  };

  const handleDelete = () => {
    if (!currentStory) return;
    deleteStory.mutate(currentStory.id, {
      onSuccess: () => {
        toast.success("Story deleted");
        if (stories.length <= 1) {
          navigate("/", { replace: true });
        } else {
          setStoryIndex((i) => Math.min(i, stories.length - 2));
        }
      },
    });
  };

  if (!stories.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-muted-foreground">No stories available</p>
        <Button variant="outline" onClick={() => navigate("/")}>
          Back to Feed
        </Button>
      </div>
    );
  }

  if (!currentStory) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="flex gap-1 mb-3">
        {stories.map((_, i) => (
          <div
            key={i}
            className="flex-1 h-0.5 rounded-full bg-muted overflow-hidden"
          >
            <div
              className="h-full bg-primary transition-all duration-75 ease-linear"
              style={{
                width: `${i < storyIndex ? 100 : i === storyIndex ? progress * 100 : 0}%`,
              }}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <Avatar className="w-8 h-8">
          <AvatarFallback className="text-xs">
            {currentStory.user?.name?.[0] || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            {currentStory.user?.name}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {formatDistanceToNow(new Date(currentStory.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {isOwner && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => navigate("/")}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div
        className="relative min-h-[300px] rounded-lg border border-primary/20 bg-muted/20 flex items-center justify-center p-8 cursor-pointer select-none"
        onClick={handleTap}
      >
        <p className="text-lg text-center whitespace-pre-wrap wrap-break-word">
          {currentStory.content}
        </p>
      </div>

      <div className="flex items-center justify-between mt-3">
        <span className="text-[10px] text-muted-foreground capitalize px-2 py-0.5 rounded-full border border-primary/20">
          {currentStory.privacy}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {storyIndex + 1} / {stories.length}
        </span>
      </div>

      {isOwner && (
        <div className="mt-4">
          <button
            onClick={() => setShowViewers(!showViewers)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
          >
            <Eye className="w-4 h-4" />
            <span>
              {currentStory.views?.length ?? 0}{" "}
              {currentStory.views?.length === 1 ? "viewer" : "viewers"}
            </span>
            {showViewers ? (
              <ChevronUp className="w-4 h-4 ml-auto" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-auto" />
            )}
          </button>

          {showViewers && viewers && (
            <div className="mt-2 space-y-2">
              {viewers.map((view) => (
                <div key={view.id} className="flex items-center gap-2 py-1">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-[10px]">
                      {view.viewer?.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{view.viewer?.name}</span>
                  <span className="text-[10px] text-muted-foreground ml-auto">
                    {formatDistanceToNow(new Date(view.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              ))}
              {viewers.length === 0 && (
                <p className="text-xs text-muted-foreground py-2">
                  No viewers yet
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

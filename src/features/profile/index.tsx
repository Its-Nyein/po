import { useBookmarks } from "@/api/queries/bookmark.queries";
import { useDeletePost, useUpdatePost } from "@/api/queries/post.queries";
import { useUser } from "@/api/queries/user.queries";
import { FollowButton } from "@/components/follow-button";
import { PostCard } from "@/components/post-card";
import { TronReticle } from "@/components/tron/TronReticle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/use-auth";
import type { Bookmark as BookmarkType } from "@/types/bookmark";
import type { Post } from "@/types/post";
import { Bookmark, FileText } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function ProfilePage() {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useUser(Number(id));
  const { user: authUser } = useAuth();
  const { data: bookmarks } = useBookmarks();
  const deletePost = useDeletePost();
  const updatePost = useUpdatePost();

  const isOwnProfile = authUser?.id === Number(id);

  const handleDelete = (postId: number) => {
    deletePost.mutate(postId, {
      onSuccess: () => toast.success("Post deleted"),
    });
  };

  const handleEdit = (postId: number, content: string) => {
    updatePost.mutate(
      { id: postId, content },
      { onSuccess: () => toast.success("Post updated") },
    );
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
      <div className="h-32 bg-primary/10 border border-primary/20 rounded-sm mb-[-40px]" />
      <div className="flex flex-col items-center gap-2 mb-2">
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
            <Link to={`/profile/${id}/followers`} className="hover:underline">
              <strong className="text-primary">
                {data?.followers?.length || 0}
              </strong>{" "}
              followers
            </Link>
            <Link to={`/profile/${id}/following`} className="hover:underline">
              <strong className="text-primary">
                {data?.following?.length || 0}
              </strong>{" "}
              following
            </Link>
          </div>
        </div>
        {data && <FollowButton user={data} />}
      </div>

      {isOwnProfile && (
        <>
          <Separator className="my-4" />
          <Tabs defaultValue="posts">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="posts">
                <FileText className="size-4" />
                Posts
              </TabsTrigger>
              <TabsTrigger value="bookmarks">
                <Bookmark className="size-4" />
                Bookmarks
              </TabsTrigger>
            </TabsList>
            <TabsContent value="posts" className="mt-4">
              {data?.posts?.length ? (
                (data.posts as Post[]).map((post: Post) => (
                  <PostCard
                    key={post.id}
                    item={post}
                    remove={handleDelete}
                    onEdit={handleEdit}
                  />
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No posts yet.
                </p>
              )}
            </TabsContent>
            <TabsContent value="bookmarks" className="mt-4">
              {bookmarks?.length ? (
                (bookmarks as BookmarkType[]).map((bookmark) => (
                  <PostCard
                    key={bookmark.id}
                    item={bookmark.post}
                    remove={handleDelete}
                    onEdit={handleEdit}
                  />
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No bookmarks yet.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}

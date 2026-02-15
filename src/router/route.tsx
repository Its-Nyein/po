import { ProtectedRoute } from "@/components/protected-route";
import { AppLayout } from "@/layouts/app-layout";
import { AuthLayout } from "@/layouts/auth-layout";
import { createBrowserRouter, Navigate } from "react-router-dom";

import LoginPage from "@/features/auth/login";
import RegisterPage from "@/features/auth/register";
import BookmarksPage from "@/features/bookmarks/index";
import FeedPage from "@/features/feed/index";
import HashtagPage from "@/features/hashtag/index";
import LikesPage from "@/features/likes/index";
import NotificationsPage from "@/features/notifications/index";
import CommentsPage from "@/features/post/comments";
import FollowListPage from "@/features/profile/follow-list";
import ProfilePage from "@/features/profile/index";
import SearchPage from "@/features/search/index";
import SettingsPage from "@/features/settings/index";
import MessagesPage from "@/features/messages/index";
import ChatPage from "@/features/messages/chat";
import StoryViewerPage from "@/features/stories/story-viewer";
import UserByUsernamePage from "@/features/user/index";
import NotFoundPage from "@/not-found";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <FeedPage />,
      },
      {
        path: "comments/:id",
        element: <CommentsPage />,
      },
      {
        path: "profile/:id",
        element: <ProfilePage />,
      },
      {
        path: "profile/:id/followers",
        element: <FollowListPage />,
      },
      {
        path: "profile/:id/following",
        element: <FollowListPage />,
      },
      {
        path: "likes/:type/:id",
        element: <LikesPage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "notifications",
        element: <NotificationsPage />,
      },
      {
        path: "bookmarks",
        element: <BookmarksPage />,
      },
      {
        path: "hashtag/:tag",
        element: <HashtagPage />,
      },
      {
        path: "user/:username",
        element: <UserByUsernamePage />,
      },
      {
        path: "stories/:userId",
        element: <StoryViewerPage />,
      },
      {
        path: "messages",
        element: <MessagesPage />,
      },
      {
        path: "messages/:id",
        element: <ChatPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);

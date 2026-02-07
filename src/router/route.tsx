import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "@/layouts/app-layout";
import { ProtectedRoute } from "@/components/protected-route";
import { AuthLayout } from "@/layouts/auth-layout";

import FeedPage from "@/features/feed/index";
import LoginPage from "@/features/auth/login";
import RegisterPage from "@/features/auth/register";
import CommentsPage from "@/features/post/comments";
import ProfilePage from "@/features/profile/index";
import LikesPage from "@/features/likes/index";
import SearchPage from "@/features/search/index";
import NotificationsPage from "@/features/notifications/index";
import BookmarksPage from "@/features/bookmarks/index";
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

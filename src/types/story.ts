import type { User } from "./user";

export interface Story {
  id: number;
  content: string;
  privacy: "public" | "friends" | "private";
  userId: number;
  user: User;
  views?: StoryView[];
  expiresAt: string;
  createdAt: string;
}

export interface StoryView {
  id: number;
  storyId: number;
  viewerId: number;
  viewer?: User;
  createdAt: string;
}

export interface StoryTrayUser {
  userId: number;
  user: User;
  stories: Story[];
  hasUnviewed: boolean;
}

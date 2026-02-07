export interface User {
  id: number;
  name: string;
  username: string;
  bio: string;
  followers?: Follow[];
  following?: Follow[];
  created_at: string;
}

export interface Follow {
  id: number;
  followerId: number;
  followingId: number;
  createdAt: string;
}

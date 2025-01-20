import { User } from "./user-interface";

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  thumbnail?: string;
  tags: string[];
  is_published: boolean;
  created_at: string;
  time_to_read: number;
  total_views: number;
  user: User;
}
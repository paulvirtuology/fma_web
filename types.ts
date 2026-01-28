
export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  date: string;
  image: string;
  category: string;
}

export interface Mission {
  id: string;
  location: string;
  description: string;
  image: string;
}

export type View = 'home' | 'about' | 'missions' | 'news' | 'contact' | 'admin' | 'login' | 'reset-password' | 'article-detail';

export interface DashboardStats {
  youthReached: number;
  communitiesCount: number;
  activeProjects: number;
  totalNews: number;
}

export interface ContentBlock {
  id: string;
  key: string;
  page: string;
  section: string;
  title?: string;
  content?: string;
  image?: string;
  metadata?: Record<string, any>;
  order_index: number;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  content?: string;
  meta_description?: string;
  is_published: boolean;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  type: string;
}

export type UserRole = 'admin' | 'editor';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string;
  created_at?: string;
  updated_at?: string;
}

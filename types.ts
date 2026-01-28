
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

export type View = 'home' | 'about' | 'missions' | 'news' | 'contact' | 'admin';

export interface DashboardStats {
  youthReached: number;
  communitiesCount: number;
  activeProjects: number;
  totalNews: number;
}

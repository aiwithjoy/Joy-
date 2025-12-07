export type SourceType = 'reddit' | 'newsletter';

export interface ContentItem {
  id: string;
  sourceType: SourceType;
  title: string;
  excerpt: string;
  url?: string;
  publishedDate: string;
  metrics: {
    upvotes?: number;
    comments?: number;
    reads?: number;
  };
  thumbnail?: string;
  tags: string[];
  isSaved: boolean;
  savedAt?: string;
  hooks: Hook[];
}

export type HookType = 'social' | 'email' | 'video' | 'ad' | 'blog';

export interface Hook {
  id: string;
  contentId: string;
  type: HookType;
  text: string;
  characterCount: number;
  createdAt: string;
}

export type SortOption = 'newest' | 'trending' | 'engaging';
export type FilterOption = 'all' | 'reddit' | 'newsletter';

export interface DashboardStats {
  scrapedToday: number;
  totalSaved: number;
  hooksGenerated: number;
}
export interface SearchResultItem {
  id: string;
  title: string;
  url: string;
  created_at: string;
  tags: string[];
  collections: Array<{
    id: string;
    name: string;
  }>;
}

export interface GlobalSearchResponse {
  items: SearchResultItem[];
  total: number;
  page: number;
  pageSize: number;
} 
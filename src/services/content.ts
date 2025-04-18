import { api } from "./api";

// 类型定义
export interface ContentMetadata {
  title: string;
  description: string;
  thumbnail_url: string;
  author: string;
  site_name: string;
  favicon_url: string;
  content_type: string;
  keywords: string[];
  language: string;
  is_article: boolean;
}

export interface Content {
  id: string;
  user_id: string;
  type: string;
  url: string;
  title: string;
  description: string;
  thumbnail_url: string;
  tags: string[];
  collection_ids: string[];
  is_favorite: boolean;
  is_archived: boolean;
  is_private: boolean;
  metadata: ContentMetadata;
  created_at: string;
  updated_at: string;
  note: string;
  read_count: number;
}

export interface CreateContentData {
  user_id: string;
  type: string;
  url: string;
  title: string;
  description: string;
  thumbnail_url: string;
  metadata: ContentMetadata;
  tags: string[];
  collection_ids: string[];
  is_favorite: boolean;
  is_private: boolean;
  note: string;
}

export interface UpdateContentData {
  user_id: string;
  title?: string;
  description?: string;
  thumbnail_url?: string;
  metadata?: ContentMetadata;
  tags?: string[];
  collection_ids?: string[];
  is_favorite?: boolean;
  is_archived?: boolean;
  is_private?: boolean;
}

export interface BatchUpdateData {
  user_id: string;
  ids: string[];
  is_archived?: boolean;
  is_favorite?: boolean;
  is_private?: boolean;
  add_tags?: string[];
  remove_tags?: string[];
  add_to_collections?: string[];
  remove_from_collections?: string[];
}

export interface BatchDeleteData {
  user_id: string;
  ids: string[];
}

export interface ImportData {
  user_id: string;
  file_content: string;
  file_format: string;
}

export interface ExportData {
  user_id: string;
  collection_id?: string;
  tags?: string[];
  file_format: string;
  include_archived: boolean;
}

export interface SearchParams {
  user_id: string;
  query: string;
  page?: number;
  page_size?: number;
  types?: string;
  collections?: string;
  tags?: string;
  include_archived?: boolean;
  date_from?: string;
  date_to?: string;
  favorites_only?: boolean;
}

export interface PaginationResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

export interface SearchResponse extends PaginationResponse<Content> {
  suggested_terms: string[];
  top_tags: Array<{
    tag: string;
    count: number;
  }>;
}

// API 实现
export const contentService = {
  /**
   * 创建内容项
   */
  createContent: async (data: CreateContentData) => {
    return api.post<Content>("/api/contents", data);
  },

  /**
   * 获取内容项
   */
  getContent: async (id: string, userId: string) => {
    return api.get<Content>(`/api/contents/${id}`, { params: { user_id: userId } });
  },

  /**
   * 更新内容项
   */
  updateContent: async (id: string, data: UpdateContentData) => {
    return api.put<Content>(`/api/contents/${id}`, data);
  },

  /**
   * 删除内容项
   */
  deleteContent: async (id: string, userId: string) => {
    return api.delete<{ success: boolean }>(`/api/contents/${id}`, {
      params: { user_id: userId }
    });
  },

  /**
   * 批量获取内容项
   */
  getContents: async (ids: string[], userId: string) => {
    return api.get<{ items: Content[] }>("/api/contents", {
      params: { user_id: userId, ids: ids.join(",") }
    });
  },

  /**
   * 批量删除内容项
   */
  batchDelete: async (data: BatchDeleteData) => {
    return api.delete<{
      success_count: number;
      failure_count: number;
      failed_ids: string[];
    }>("/api/contents/batch", { data });
  },

  /**
   * 按标签获取内容项
   */
  getContentsByTags: async (tags: string[], userId: string, page = 1, pageSize = 20) => {
    return api.get<PaginationResponse<Content>>("/api/contents/tags", {
      params: {
        user_id: userId,
        tags: tags.join(","),
        page,
        page_size: pageSize
      }
    });
  },

  /**
   * 从URL提取元数据
   */
  extractMetadata: async (url: string) => {
    return api.post<ContentMetadata>("/api/contents/metadata", { url });
  },

  /**
   * 获取用户最近添加的内容项
   */
  getRecentContents: async (
    userId: string,
    limit = 10,
    type?: string,
    excludeArchived = true
  ) => {
    return api.get<{ items: Content[] }>("/api/contents/recent", {
      params: {
        user_id: userId,
        limit,
        type,
        exclude_archived: excludeArchived
      }
    });
  },

  /**
   * 批量更新内容项
   */
  batchUpdate: async (data: BatchUpdateData) => {
    return api.put<{
      success_count: number;
      failure_count: number;
      failed_ids: string[];
    }>("/api/contents/batch", data);
  },

  /**
   * 从文件导入内容
   */
  importContents: async (data: ImportData) => {
    return api.post<{
      total_processed: number;
      success_count: number;
      failure_count: number;
      failed_urls: string[];
    }>("/api/contents/import", data);
  },

  /**
   * 导出内容到文件
   */
  exportContents: async (data: ExportData) => {
    return api.post<{
      file_content: string;
      file_name: string;
      mime_type: string;
      item_count: number;
    }>("/api/contents/export", data);
  },

  /**
   * 内容项全文搜索
   */
  searchContents: async (params: SearchParams) => {
    return api.get<SearchResponse>("/api/contents/search", { params });
  },

  /**
   * 添加内容备注
   */
  addNote: async (itemId: string, userId: string, note: string) => {
    return api.post<Content>(`/api/contents/${itemId}/notes`, {
      user_id: userId,
      note
    });
  },

  /**
   * 更新内容备注
   */
  updateNote: async (itemId: string, userId: string, note: string) => {
    return api.put<Content>(`/api/contents/${itemId}/notes`, {
      user_id: userId,
      note
    });
  },

  /**
   * 获取内容备注
   */
  getNote: async (itemId: string, userId: string) => {
    return api.get<{
      item_id: string;
      note: string;
      updated_at: string;
    }>(`/api/contents/${itemId}/notes`, {
      params: { user_id: userId }
    });
  }
}; 
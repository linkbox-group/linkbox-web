import { api } from "./api";

// 基础类型定义
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

// 请求参数接口
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

export interface GetByTagsParams {
  user_id: string;
  tags: string[];
  page?: number;
  page_size?: number;
}

export interface GetRecentParams {
  user_id: string;
  limit?: number;
  type?: string;
  exclude_archived?: boolean;
}

export interface NoteParams {
  user_id: string;
  note: string;
}

// 响应接口
export interface PaginationResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

export interface SearchResponse {
  msg: string;
  code: number;
  data: Content | Content[];
}

export interface NoteResponse {
  item_id: string;
  note: string;
  updated_at: string;
}

// API 实现
export const contentService = {
  /**
   * 创建内容项
   */
  create: (data: CreateContentData) => {
    return api.post<Content>("/contents", data);
  },

  /**
   * 获取内容项详情
   */
  getDetail: (id: string, userId: string) => {
    return api.get<Content>(`/contents/${id}`, { params: { user_id: userId } });
  },

  /**
   * 更新内容项
   */
  update: (id: string, data: UpdateContentData) => {
    return api.put<Content>(`/contents/${id}`, data);
  },

  /**
   * 删除内容项
   */
  delete: (id: string, userId: string) => {
    return api.delete<{ success: boolean }>(`/contents/${id}`, {
      params: { user_id: userId }
    });
  },

  /**
   * 按标签获取内容项
   */
  getByTags: (params: GetByTagsParams) => {
    return api.get<PaginationResponse<Content>>("/contents/tags", { params });
  },

  /**
   * 从URL提取元数据
   */
  getMetadata: (url: string) => {
    return api.post<ContentMetadata>("/contents/metadata", { url });
  },

  /**
   * 获取用户最近添加的内容项
   */
  getRecent: (params: GetRecentParams) => {
    return api.get<{ items: Content[] }>("/contents/recent", { params });
  },

  /**
   * 批量更新内容项
   */
  batchUpdate: (data: BatchUpdateData) => {
    return api.put<{
      success_count: number;
      failure_count: number;
      failed_ids: string[];
    }>("/contents/batch", data);
  },

  /**
   * 从文件导入内容
   */
  importContents: (data: ImportData) => {
    return api.post<{
      total_processed: number;
      success_count: number;
      failure_count: number;
      failed_urls: string[];
    }>("/contents/import", data);
  },

  /**
   * 导出内容到文件
   */
  exportContents: (data: ExportData) => {
    return api.post<{
      file_content: string;
      file_name: string;
      mime_type: string;
      item_count: number;
    }>("/contents/export", data);
  },

  /**
   * 内容项全文搜索
   */
  search: (params: SearchParams) => {
    return api.get<SearchResponse>("/contents/search", { params });
  },

  /**
   * 添加内容备注
   */
  addNote: (itemId: string, data: NoteParams) => {
    return api.post<Content>(`/contents/${itemId}/notes`, data);
  },

  /**
   * 更新内容备注
   */
  updateNote: (itemId: string, data: NoteParams) => {
    return api.put<Content>(`/contents/${itemId}/notes`, data);
  },

  /**
   * 获取内容备注
   */
  getNote: (itemId: string, userId: string) => {
    return api.get<NoteResponse>(`/contents/${itemId}/notes`, {
      params: { user_id: userId }
    });
  }
}; 
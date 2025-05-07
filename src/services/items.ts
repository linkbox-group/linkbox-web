import { api } from "./api";
import { ApiResponse } from "./api";

/**
 * 内容项元数据
 */
export interface ItemMetadata {
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

/**
 * 内容项
 */
export interface Item {
  id: string;
  user_id: string;
  type: string;
  title: string;
  url: string;
  description: string;
  thumbnail_url: string;
  tag_names: string[] | null;
  tags: string[] | null;
  organization_path: string;
  organization_id: string;
  note: string;
  deleted_at: string;
  created_at: string;
  updated_at: string;
}

/**
 * 创建内容项请求参数
 */
export interface CreateItemRequest {
  type: number;
  url: string;
  organization_id: string;
  title: string;
  description: string;
  note: string;
  tags?: string[];
}

/**
 * 更新内容项请求参数
 */
export interface UpdateItemRequest {
  user_id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  tags: string[];
  organization_ids: string[];
}

/**
 * 按标签获取内容项请求参数
 */
export interface GetItemsByTagsRequest {
  tags: string[];
  pagination: {
    page: number;
    page_size: number;
  };
}

/**
 * 获取组织内容项请求参数
 */
export interface GetOrganizationItemsRequest {
  organization_id: string;
  page: number;
  page_size: number;
  sort_field: string;
  sort_direction: "asc" | "desc";
}

/**
 * 搜索内容项请求参数
 */
export interface SearchItemsRequest {
  query: string;
  item_type: "LINK" | "NOTE";
  pagination: {
    page: number;
    page_size: number;
  };
}

/**
 * 分页响应
 */
export interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

/**
 * 内容项服务
 */
export const itemService = {
  /**
   * 创建内容项
   */
  create: async (data: CreateItemRequest) => {
    return api.post<ApiResponse<Item>>("/items", data);
  },

  /**
   * 获取内容项
   */
  get: async (id: string) => {
    return api.get<ApiResponse<Item>>(`/items/${id}`);
  },

  /**
   * 更新内容项
   */
  update: async (id: string, data: UpdateItemRequest) => {
    return api.put<ApiResponse<Item>>(`/items/${id}`, data);
  },

  /**
   * 删除内容项
   */
  delete: async (id: string) => {
    return api.delete<ApiResponse<{ success: boolean }>>(`/items/${id}`);
  },

  /**
   * 按标签获取内容项
   */
  getByTags: async (data: GetItemsByTagsRequest) => {
    return api.post<ApiResponse<PaginationResponse<Item>>>("/items/tags", data);
  },

  /**
   * 获取组织内容项
   */
  getOrganizationItems: async (data: GetOrganizationItemsRequest) => {
    return api.post<ApiResponse<PaginationResponse<Item>>>("/items/organization", data);
  },

  /**
   * 搜索内容项
   */
  search: async (data: SearchItemsRequest) => {
    return api.post<ApiResponse<PaginationResponse<Item>>>("/items/search", data);
  },
};

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
  type: number;
  url: string;
  title: string;
  description: string;
  thumbnail_url: string;
  tags: string[];
  collection_ids: string[];
  is_favorite: boolean;
  is_archived: boolean;
  is_private: boolean;
  metadata: ItemMetadata;
  created_at: string;
  updated_at: string;
  note: string;
  read_count: number;
}

/**
 * 创建内容项请求参数
 */
export interface CreateItemRequest {
  type: number;
  url: string;
  title: string;
  description: string;
}

/**
 * 更新内容项请求参数
 */
export interface UpdateItemRequest {
  user_id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  metadata: ItemMetadata;
  tags: string[];
  collection_ids: string[];
  is_favorite: boolean;
  is_archived: boolean;
  is_private: boolean;
}

/**
 * 按标签获取内容项请求参数
 */
export interface GetItemsByTagsRequest {
  tags: string[];
  page: number;
  page_size: number;
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
 * 分页响应
 */
export interface PaginationResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
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
  update: async (id: string, data: Partial<CreateItemRequest>) => {
    return api.put<ApiResponse<Item>>(`/items/${id}`, data);
  },

  /**
   * 删除内容项
   */
  delete: async (id: string) => {
    return api.delete<ApiResponse<{}>>(`/items/${id}`);
  },

  /**
   * 按标签获取内容项
   */
  getByTags: async (data: {
    tags: string[];
    pagination: {
      page: number;
      page_size: number;
    };
  }) => {
    return api.post<ApiResponse<{
      items: Item[];
      total: number;
      page: number;
      page_size: number;
      total_pages: number;
    }>>("/items/tags", data);
  },

  /**
   * 获取组织内容项
   */
  getOrganizationItems: async (data: GetOrganizationItemsRequest) => {
    return api.post<PaginationResponse<Item>>("/items/organization", data);
  },
};

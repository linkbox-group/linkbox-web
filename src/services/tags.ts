import { api } from './api';

/**
 * 标签信息
 */
export interface Tag {
  id: string;
  user_id: string;
  name: string;
  description: string;
  color: string;
  item_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * API 响应基础结构
 */
export interface ApiResponse<T> {
  msg: string;
  code: number;
  data: T;
}

/**
 * 分页信息
 */
export interface Pagination {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

/**
 * 获取标签列表请求参数
 */
export interface GetTagsRequest {
  user_id: string;
  page?: number;
  page_size?: number;
  search_query?: string;
}

/**
 * 获取标签列表响应
 */
export interface GetTagsResponse {
  tags: Tag[];
  pagination: Pagination;
}

/**
 * 创建标签请求参数
 */
export interface CreateTagRequest {
  user_id: string;
  name: string;
  description: string;
  color: string;
}

/**
 * 更新标签请求参数
 */
export interface UpdateTagRequest {
  user_id: string;
  name?: string;
  description?: string;
  color?: string;
}

/**
 * 标签操作请求参数
 */
export interface TagOperationRequest {
  tags: string[];
  item_ids: string[];
}

/**
 * 标签操作响应
 */
export interface TagOperationResponse {
  success_count: number;
  failure_count: number;
  failed_item_ids: null;
}

/**
 * 合并标签请求参数
 */
export interface MergeTagsRequest {
  user_id: string;
  source_tag_ids: string[];
  target_tag_id: string;
  delete_source_tags?: boolean;
}

/**
 * 合并标签响应
 */
export interface MergeTagsResponse {
  affected_items: number;
  target_tag: Tag;
}

/**
 * 标签统计信息
 */
export interface TagStats {
  tag: Tag;
  item_count: number;
  collection_usage: Array<{
    collection_id: string;
    collection_name: string;
    count: number;
  }>;
}

/**
 * 标签统计响应
 */
export interface TagStatsResponse {
  tag_stats: TagStats[];
  total_tags: number;
  unused_tags: number;
}

/**
 * 相关标签信息
 */
export interface RelatedTag {
  tag: Tag;
  correlation: number;
  co_occurrence: number;
}

/**
 * 相关标签响应
 */
export interface RelatedTagsResponse {
  tag_id: string;
  related_tags: RelatedTag[];
}

/**
 * 标签建议请求参数
 */
export interface SuggestTagsRequest {
  user_id: string;
  url: string;
  title?: string;
  content?: string;
  limit?: number;
}

/**
 * 标签建议
 */
export interface TagSuggestion {
  tag: string;
  confidence: number;
  source: 'content' | 'history' | 'popular';
}

/**
 * 标签建议响应
 */
export interface SuggestTagsResponse {
  tag_suggestions: TagSuggestion[];
}

/**
 * 标签服务
 */
export const tagService = {
  /**
   * 获取所有标签
   * @returns 标签列表
   */
  getTags: async (): Promise<ApiResponse<GetTagsResponse>> => {
    return api.get<ApiResponse<GetTagsResponse>>('/users/tags');
  },

  /**
   * 获取标签详情
   * @param id 标签ID
   * @param userId 用户ID
   * @returns 标签信息
   */
  getTag: async (id: string, userId: string): Promise<Tag> => {
    return api.get<Tag>(`/tags/${id}`, { params: { user_id: userId } });
  },

  /**
   * 创建标签
   * @param data 标签信息
   * @returns 创建的标签
   */
  createTag: async (data: CreateTagRequest): Promise<ApiResponse<{ data: Tag }>> => {
    return api.post<ApiResponse<{ data: Tag }>>('/tags', data);
  },

  /**
   * 更新标签
   * @param id 标签ID
   * @param data 更新信息
   * @returns 更新后的标签
   */
  updateTag: async (id: string, data: UpdateTagRequest): Promise<ApiResponse<{ data: Tag }>> => {
    return api.put<ApiResponse<{ data: Tag }>>(`/tags/${id}`, data);
  },

  /**
   * 删除标签
   * @param id 标签ID
   * @param userId 用户ID
   * @returns 删除结果
   */
  deleteTag: async (id: string, userId: string): Promise<ApiResponse<{ data: { success: boolean } }>> => {
    return api.delete<ApiResponse<{ data: { success: boolean } }>>(`/tags/${id}`, { params: { user_id: userId } });
  },

  /**
   * 添加标签到内容项
   * @param data 操作信息
   * @returns 操作结果
   */
  addTagsToItems: async (data: TagOperationRequest): Promise<ApiResponse<{ data: TagOperationResponse }>> => {
    return api.post<ApiResponse<{ data: TagOperationResponse }>>('/tags/items', data);
  },

  /**
   * 从内容项移除标签
   * @param data 操作信息
   * @returns 操作结果
   */
  removeTagsFromItems: async (data: TagOperationRequest): Promise<TagOperationResponse> => {
    return api.delete<TagOperationResponse>('/tags/items', { data });
  },

  /**
   * 获取内容项的标签
   * @param itemId 内容项ID
   * @param userId 用户ID
   * @returns 标签列表
   */
  getItemTags: async (itemId: string, userId: string): Promise<{ item_id: string; tags: Tag[] }> => {
    return api.get<{ item_id: string; tags: Tag[] }>(`/items/${itemId}/tags`, { params: { user_id: userId } });
  },

  /**
   * 合并标签
   * @param data 合并信息
   * @returns 合并结果
   */
  mergeTags: async (data: MergeTagsRequest): Promise<MergeTagsResponse> => {
    return api.post<MergeTagsResponse>('/tags/merge', data);
  },

  /**
   * 获取标签使用统计
   * @param userId 用户ID
   * @param topCount 返回前N个标签
   * @param includeUnused 是否包含未使用标签
   * @returns 统计信息
   */
  getTagStats: async (userId: string, topCount?: number, includeUnused?: boolean): Promise<TagStatsResponse> => {
    return api.get<TagStatsResponse>(`/users/${userId}/tags/stats`, {
      params: { top_count: topCount, include_unused: includeUnused }
    });
  },

  /**
   * 获取相关标签
   * @param tagId 标签ID
   * @param userId 用户ID
   * @param limit 返回数量
   * @returns 相关标签
   */
  getRelatedTags: async (tagId: string, userId: string, limit?: number): Promise<RelatedTagsResponse> => {
    return api.get<RelatedTagsResponse>(`/tags/${tagId}/related`, {
      params: { user_id: userId, limit }
    });
  },

  /**
   * 自动建议标签
   * @param data 建议参数
   * @returns 建议的标签
   */
  suggestTags: async (data: SuggestTagsRequest): Promise<SuggestTagsResponse> => {
    return api.post<SuggestTagsResponse>('/tags/suggest', data);
  }
}; 
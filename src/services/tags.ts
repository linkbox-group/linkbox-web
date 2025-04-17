import { api } from './api';

/**
 * 标签信息
 */
export interface Tag {
  id: number;
  name: string;
  color: string;
  useCount: number;
  isSystem: boolean;
  createdAt: string;
  updatedAt?: string;
}

/**
 * 获取标签列表请求参数
 */
export interface GetTagsRequest {
  keyword?: string;
}

/**
 * 获取标签列表响应
 */
export interface GetTagsResponse {
  tags: Tag[];
}

/**
 * 创建标签请求参数
 */
export interface CreateTagRequest {
  name: string;
  color?: string;
}

/**
 * 更新标签请求参数
 */
export interface UpdateTagRequest {
  name?: string;
  color?: string;
}

/**
 * 标签服务
 */
export const tagService = {
  /**
   * 获取所有标签
   * @param params 请求参数
   * @returns 标签列表
   */
  getTags: async (params?: GetTagsRequest): Promise<GetTagsResponse> => {
    return api.get<GetTagsResponse>('/tags', { params });
  },

  /**
   * 创建标签
   * @param data 标签信息
   * @returns 创建的标签
   */
  createTag: async (data: CreateTagRequest): Promise<Tag> => {
    return api.post<Tag>('/tags', data);
  },

  /**
   * 更新标签
   * @param id 标签ID
   * @param data 更新信息
   * @returns 更新后的标签
   */
  updateTag: async (id: number, data: UpdateTagRequest): Promise<Tag> => {
    return api.put<Tag>(`/tags/${id}`, data);
  },

  /**
   * 删除标签
   * @param id 标签ID
   * @returns 删除结果
   */
  deleteTag: async (id: number): Promise<void> => {
    return api.delete<void>(`/tags/${id}`);
  }
}; 
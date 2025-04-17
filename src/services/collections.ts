import { api } from './api';

/**
 * 收藏夹信息
 */
export interface Collection {
  id: number;
  name: string;
  description: string;
  parentId: number | null;
  isDefault: boolean;
  isShared: boolean;
  shareCode?: string;
  itemsCount: number;
  hasChildren: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * 获取收藏夹列表请求参数
 */
export interface GetCollectionsRequest {
  parentId?: number | null;
}

/**
 * 获取收藏夹列表响应
 */
export interface GetCollectionsResponse {
  collections: Collection[];
  total: number;
}

/**
 * 创建收藏夹请求参数
 */
export interface CreateCollectionRequest {
  name: string;
  description: string;
  parentId: number | null;
}

/**
 * 更新收藏夹请求参数
 */
export interface UpdateCollectionRequest {
  name?: string;
  description?: string;
  parentId?: number | null;
}

/**
 * 分享收藏夹请求参数
 */
export interface ShareCollectionRequest {
  isPublic: boolean;
  expireAt?: string;
  permission: 'read' | 'edit';
}

/**
 * 分享收藏夹响应
 */
export interface ShareCollectionResponse {
  shareCode: string;
  shareUrl: string;
  expireAt?: string;
}

/**
 * 收藏夹服务
 */
export const collectionService = {
  /**
   * 获取收藏夹列表
   * @param params 请求参数
   * @returns 收藏夹列表
   */
  getCollections: async (params?: GetCollectionsRequest): Promise<GetCollectionsResponse> => {
    return api.get<GetCollectionsResponse>('/collections', { params });
  },

  /**
   * 创建收藏夹
   * @param data 收藏夹信息
   * @returns 创建的收藏夹
   */
  createCollection: async (data: CreateCollectionRequest): Promise<Collection> => {
    return api.post<Collection>('/collections', data);
  },

  /**
   * 更新收藏夹
   * @param id 收藏夹ID
   * @param data 更新信息
   * @returns 更新后的收藏夹
   */
  updateCollection: async (id: number, data: UpdateCollectionRequest): Promise<Collection> => {
    return api.put<Collection>(`/collections/${id}`, data);
  },

  /**
   * 删除收藏夹
   * @param id 收藏夹ID
   * @returns 删除结果
   */
  deleteCollection: async (id: number): Promise<void> => {
    return api.delete<void>(`/collections/${id}`);
  },

  /**
   * 分享收藏夹
   * @param id 收藏夹ID
   * @param data 分享信息
   * @returns 分享结果
   */
  shareCollection: async (id: number, data: ShareCollectionRequest): Promise<ShareCollectionResponse> => {
    return api.post<ShareCollectionResponse>(`/collections/${id}/share`, data);
  },

  /**
   * 取消分享收藏夹
   * @param id 收藏夹ID
   * @returns 取消分享结果
   */
  unshareCollection: async (id: number): Promise<void> => {
    return api.delete<void>(`/collections/${id}/share`);
  }
}; 
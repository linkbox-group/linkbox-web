import { api } from './api';

/**
 * 收藏项目类型
 */
export type ItemType = 'text' | 'image' | 'link';

/**
 * 排序字段
 */
export type SortField = 'created_at' | 'updated_at' | 'title';

/**
 * 排序方式
 */
export type SortOrder = 'asc' | 'desc';

/**
 * 标签信息
 */
export interface Tag {
  id: number;
  name: string;
  color: string;
}

/**
 * 收藏夹信息（简化版）
 */
export interface CollectionInfo {
  id: number;
  name: string;
}

/**
 * 收藏项目信息
 */
export interface Item {
  id: number;
  type: ItemType;
  title: string;
  content: string;
  url?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  sourceDomain?: string;
  sourcePageTitle?: string;
  isFavorited?: boolean;
  tags: Tag[];
  collections: CollectionInfo[];
  createdAt: string;
  updatedAt: string;
}

/**
 * 分页信息
 */
export interface Pagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/**
 * 获取收藏项目列表请求参数
 */
export interface GetItemsRequest {
  collectionId?: number;
  type?: ItemType | 'all';
  tags?: number[];
  keyword?: string;
  sortBy?: SortField;
  sortOrder?: SortOrder;
  page?: number;
  pageSize?: number;
}

/**
 * 获取收藏项目列表响应
 */
export interface GetItemsResponse {
  items: Item[];
  pagination: Pagination;
}

/**
 * 添加收藏请求参数
 */
export interface CreateItemRequest {
  type: ItemType;
  title: string;
  content: string;
  url?: string;
  imageUrl?: string;
  collectionIds: number[];
  tagIds: number[];
}

/**
 * 更新收藏项目请求参数
 */
export interface UpdateItemRequest {
  title?: string;
  content?: string;
  collectionIds?: number[];
  tagIds?: number[];
}

/**
 * 批量操作类型
 */
export type BatchOperation = 'move' | 'copy' | 'delete' | 'tag';

/**
 * 批量操作请求参数
 */
export interface BatchOperationRequest {
  operation: BatchOperation;
  itemIds: number[];
  targetCollectionId?: number;
  tagIds?: number[];
}

/**
 * 批量操作响应
 */
export interface BatchOperationResponse {
  successCount: number;
  failCount: number;
}

/**
 * 收藏项目服务
 */
export const itemService = {
  /**
   * 获取收藏项目列表
   * @param params 请求参数
   * @returns 收藏项目列表
   */
  getItems: async (params?: GetItemsRequest): Promise<GetItemsResponse> => {
    return api.get<GetItemsResponse>('/items', { params });
  },

  /**
   * 添加收藏
   * @param data 收藏项目信息
   * @returns 创建的收藏项目
   */
  createItem: async (data: CreateItemRequest): Promise<Item> => {
    return api.post<Item>('/items', data);
  },

  /**
   * 更新收藏项目
   * @param id 收藏项目ID
   * @param data 更新信息
   * @returns 更新后的收藏项目
   */
  updateItem: async (id: number, data: UpdateItemRequest): Promise<Item> => {
    return api.put<Item>(`/items/${id}`, data);
  },

  /**
   * 删除收藏项目
   * @param id 收藏项目ID
   * @returns 删除结果
   */
  deleteItem: async (id: number): Promise<void> => {
    return api.delete<void>(`/items/${id}`);
  },

  /**
   * 批量操作收藏项目
   * @param data 批量操作信息
   * @returns 批量操作结果
   */
  batchOperation: async (data: BatchOperationRequest): Promise<BatchOperationResponse> => {
    return api.post<BatchOperationResponse>('/items/batch', data);
  },

  /**
   * 移动收藏项目到其他收藏夹
   * @param itemIds 收藏项目ID数组
   * @param targetCollectionId 目标收藏夹ID
   * @returns 批量操作结果
   */
  moveItems: async (itemIds: number[], targetCollectionId: number): Promise<BatchOperationResponse> => {
    return itemService.batchOperation({
      operation: 'move',
      itemIds,
      targetCollectionId
    });
  },

  /**
   * 复制收藏项目到其他收藏夹
   * @param itemIds 收藏项目ID数组
   * @param targetCollectionId 目标收藏夹ID
   * @returns 批量操作结果
   */
  copyItems: async (itemIds: number[], targetCollectionId: number): Promise<BatchOperationResponse> => {
    return itemService.batchOperation({
      operation: 'copy',
      itemIds,
      targetCollectionId
    });
  },

  /**
   * 批量删除收藏项目
   * @param itemIds 收藏项目ID数组
   * @returns 批量操作结果
   */
  deleteItems: async (itemIds: number[]): Promise<BatchOperationResponse> => {
    return itemService.batchOperation({
      operation: 'delete',
      itemIds
    });
  },

  /**
   * 批量添加标签
   * @param itemIds 收藏项目ID数组
   * @param tagIds 标签ID数组
   * @returns 批量操作结果
   */
  addTagsToItems: async (itemIds: number[], tagIds: number[]): Promise<BatchOperationResponse> => {
    return itemService.batchOperation({
      operation: 'tag',
      itemIds,
      tagIds
    });
  }
}; 
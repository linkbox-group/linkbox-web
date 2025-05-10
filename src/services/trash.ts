import { api } from "./api";
import { ApiResponse } from "./api";

/**
 * 回收站项目
 */
export interface TrashItem {
  id: string;
  user_id: string;
  title: string;
  deleted_at: string;
  expired_at: string;
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
 * 获取回收站列表请求参数
 */
export interface GetTrashListRequest {
  page?: number;
  page_size?: number;
}

/**
 * 恢复项目请求参数
 */
export interface RecoveryItemRequest {
  item_id: string;
}

/**
 * 回收站服务
 */
export const trashService = {
  /**
   * 获取回收站列表
   */
  getList: async (params: GetTrashListRequest = {}) => {
    return api.get<ApiResponse<PaginationResponse<TrashItem>>>("/trash/list", {
      params,
    });
  },

  /**
   * 恢复项目
   */
  recovery: async (data: RecoveryItemRequest) => {
    return api.post<ApiResponse<{ success: boolean }>>("/trash/recovery", data);
  },

  /**
   * 彻底删除项目
   */
  delete: async (itemId: string) => {
    return api.delete<ApiResponse<{ success: boolean }>>(`/trash/${itemId}`);
  },
}; 
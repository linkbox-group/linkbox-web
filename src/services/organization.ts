import { api } from './api';

export interface Organization {
  id: string;
  code: string;
  parent_code: string;
  parent_codes?: string;
  tree_leaf?: string;
  tree_level?: number;
  tree_names?: string;
  name: string;
  user_id: string;
  description: string;
  is_default?: boolean;
  is_shared?: boolean;
  share_code?: string;
  share_expire_at?: string;
  sort_order: number;
  items_count?: number;
  created_at: string;
  updated_at: string;
}

export interface OrganizationTree {
  data: Organization;
  children: OrganizationTree[];
}

export interface OrganizationActivity {
  id: string;
  organization_id: string;
  user_id: string;
  type: string;
  item_id?: string;
  description: string;
  created_at: string;
}

export interface Pagination {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface OrganizationResponse {
  msg: string;
  code: number;
  data: Organization;
}

export interface OrganizationListResponse {
  msg: string;
  code: number;
  data: {
    organizations: Organization[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

export interface CreateOrganizationParams {
  name: string;
  parent_code: string;
  description: string;
  sort_order: number;
}

export interface UpdateOrganizationParams {
  id: string;
  name: string;
  description: string;
  sort_order: number;
}

export interface MoveOrganizationParams {
  id: string;
  new_parent_code: string;
}

interface MoveOrganizationResponse {
  msg: string;
  code: number;
  data: {
    success: boolean;
  };
}

export interface AddItemsParams {
  organization_id: string;
  item_ids: string[];
}

export interface RemoveItemsParams {
  organization_id: string;
  item_ids: string[];
}

export interface ReorderItemsParams {
  organization_id: string;
  user_id: string;
  item_orders: Array<{
    item_id: string;
    sort_order: number;
  }>;
}

export interface ReorderOrganizationsParams {
  user_id: string;
  organization_orders: Array<{
    organization_id: string;
    sort_order: number;
  }>;
}

export const organizationService = {
  // 创建组织
  create: (params: CreateOrganizationParams) => {
    return api.post<OrganizationResponse>('/organization', params);
  },

  // 获取组织详情
  getDetail: (id: string) => {
    return api.get<OrganizationResponse>(`/organization/${id}`);
  },

  // 更新组织
  update: (params: UpdateOrganizationParams) => {
    return api.put<OrganizationResponse>('/organization', params);
  },

  // 删除组织
  delete: (id: string, cascade: boolean = true) => {
    return api.delete<{ msg: string; code: number; data: { success: boolean } }>(
      `/organization/${id}`,
      { params: { cascade } }
    );
  },

  // 获取用户的组织列表
  getList: () => {
    return api.get<OrganizationListResponse>('/organization');
  },

  // 获取组织子节点
  getChildren: (user_id: string, parent_code: string, recursive: boolean = false) => {
    return api.get<{ data: { children: Organization[] } }>('/organization/children', {
      params: { user_id, parent_code, recursive }
    });
  },

  // 移动组织
  move: (params: MoveOrganizationParams) => {
    return api.patch<MoveOrganizationResponse>('/organization/move', params);
  },

  // 添加内容项到组织
  addItems: (params: AddItemsParams) => {
    return api.post<{ msg: string; code: number }>('/organization/items', params);
  },

  // 从组织移除内容项
  removeItems: (params: RemoveItemsParams) => {
    return api.delete<{ msg: string; code: number }>('/organization/items', {
      data: params,
    });
  },

  // 排序组织中的内容项
  reorderItems: (params: ReorderItemsParams) => {
    return api.put<{ data: { success: boolean } }>('/organization/reorder_items', params);
  },

  // 排序组织
  reorder: (params: ReorderOrganizationsParams) => {
    return api.put<{ data: { success: boolean } }>('/organization/reorder', params);
  },

  // 获取组织最近活动
  getActivities: (organization_id: string, user_id: string, page: number = 1, page_size: number = 20) => {
    return api.get<{ 
      data: { 
        activities: OrganizationActivity[];
        pagination: Pagination;
      } 
    }>(`/organization/activity/${organization_id}`, {
      params: { user_id, page, page_size }
    });
  }
}; 
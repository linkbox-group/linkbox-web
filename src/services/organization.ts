import { api } from './api';

export interface Organization {
  id: string;
  code: string;
  parent_code: string;
  parent_codes: string;
  tree_leaf: string;
  tree_level: number;
  tree_names: string;
  name: string;
  user_id: string;
  description: string;
  is_default: boolean;
  is_shared: boolean;
  share_code?: string;
  share_expire_at?: string;
  sort_order: number;
  items_count: number;
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

export interface CreateOrganizationParams {
  user_id: string;
  name: string;
  code: string;
  parent_code: string;
  description: string;
  is_default: boolean;
  is_shared: boolean;
  share_code?: string;
  share_expire_at?: string;
  sort_order: number;
}

export interface UpdateOrganizationParams {
  id: string;
  user_id: string;
  name?: string;
  description?: string;
  is_shared?: boolean;
  sort_order?: number;
}

export interface MoveOrganizationParams {
  id: string;
  user_id: string;
  new_parent_code: string;
}

export interface AddItemsParams {
  organization_id: string;
  user_id: string;
  item_ids: string[];
}

export interface RemoveItemsParams {
  organization_id: string;
  user_id: string;
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
    return api.post<{ data: Organization }>('/organization', params);
  },

  // 获取组织详情
  getDetail: (id: string, user_id: string) => {
    return api.get<{ data: Organization }>(`/organization/${id}`, {
      params: { user_id }
    });
  },

  // 更新组织
  update: (params: UpdateOrganizationParams) => {
    return api.put<{ data: Organization }>('/organization', params);
  },

  // 删除组织
  delete: (id: string, user_id: string, cascade: boolean = true) => {
    return api.delete<{ data: { success: boolean } }>(`/organization/${id}`, {
      params: { user_id, cascade }
    });
  },

  // 获取用户的组织列表
  getList: (user_id: string) => {
    return api.get<{ data: { organizations: Organization[] } }>('/organization', {
      params: { user_id }
    });
  },

  // 获取组织树
  getTree: (user_id: string, root_code: string) => {
    return api.get<{ data: OrganizationTree }>('/organization/tree', {
      params: { user_id, root_code }
    });
  },

  // 获取组织子节点
  getChildren: (user_id: string, parent_code: string, recursive: boolean = false) => {
    return api.get<{ data: { children: Organization[] } }>('/organization/children', {
      params: { user_id, parent_code, recursive }
    });
  },

  // 移动组织
  move: (params: MoveOrganizationParams) => {
    return api.put<{ data: { success: boolean } }>('/organization/move', params);
  },

  // 添加内容项到组织
  addItems: (params: AddItemsParams) => {
    return api.post<{ data: { success: boolean } }>('/organization/items', params);
  },

  // 从组织移除内容项
  removeItems: (params: RemoveItemsParams) => {
    return api.delete<{ data: { success: boolean } }>('/organization/items', {
      data: params
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
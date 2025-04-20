import { api } from './api';

/**
 * 通用响应类型
 */
export interface ApiResponse<T> {
  msg: string;
  code: number;
  data: T;
}

/**
 * 发送验证码请求参数
 */
export interface SendCodeRequest {
  email: string;
}

/**
 * 用户注册请求参数
 */
export interface RegisterRequest {
  email: string;
  code: string;
  password: string;
  confirm_password: string;
}

/**
 * 用户登录请求参数
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * 第三方登录请求参数
 */
export interface OAuthLoginRequest {
  provider: string;
  code: string;
  redirect_uri: string;
}

/**
 * 用户信息
 */
export interface UserInfo {
  user_id: number;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  theme: string;
  chat_count: number;
  memoir_count: number;
  use_day: number;
  token?: string;
}

/**
 * 登录响应
 */
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: UserInfo;
}

/**
 * 更新用户信息请求参数
 */
export interface UpdateUserInfoRequest {
  username: string;
  avatar: string;
  theme: string;
  bio: string;
}

/**
 * 修改密码请求参数
 */
export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

/**
 * 忘记密码请求参数
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * 重置密码请求参数
 */
export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

/**
 * 删除账号请求参数
 */
export interface DeleteAccountRequest {
  user_id: string;
  password: string;
}

/**
 * 用户列表查询参数
 */
export interface UserListQuery {
  page?: number;
  page_size?: number;
  search_query?: string;
  roles?: string[];
  sort?: string;
  sort_direction?: 'asc' | 'desc';
}

/**
 * 用户列表响应
 */
export interface UserListResponse {
  users: UserInfo[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

/**
 * 用户订阅计划信息
 */
export interface SubscriptionInfo {
  id: string;
  plan_name: string;
  plan_id: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  auto_renew: boolean;
  next_billing_date: string;
  payment_method: string;
  features: string[];
}

/**
 * 更新订阅计划请求参数
 */
export interface UpdateSubscriptionRequest {
  user_id: string;
  plan_id: string;
  auto_renew: boolean;
}

/**
 * 用户服务
 */
export const userService = {
  /**
   * 发送验证码
   */
  sendCode: async (data: SendCodeRequest) => {
    return api.post<ApiResponse<{ success: boolean; message: string }>>('/api/user/send_code', data);
  },

  /**
   * 用户注册
   */
  register: async (data: RegisterRequest) => {
    return api.post<ApiResponse<UserInfo>>('/api/user/register', data);
  },

  /**
   * 用户登录
   */
  login: async (data: LoginRequest) => {
    return api.post<ApiResponse<UserInfo>>('/api/user/login', data);
  },

  /**
   * 获取用户信息
   */
  getUserInfo: async () => {
    return api.get<ApiResponse<UserInfo>>('/api/user/info');
  },

  /**
   * 更新用户信息
   */
  updateUserInfo: async (data: UpdateUserInfoRequest) => {
    return api.put<ApiResponse<{ success: boolean; message: string }>>('/api/user/info', data);
  },

  /**
   * 修改密码
   */
  changePassword: async (data: ChangePasswordRequest) => {
    return api.put<ApiResponse<{ success: boolean; message: string }>>('/api/user/password', data);
  },

  /**
   * 注销用户
   */
  deleteUser: async () => {
    return api.delete<ApiResponse<{ success: boolean; message: string }>>('/api/user');
  },

  /**
   * 第三方登录
   */
  oauthLogin: async (data: OAuthLoginRequest) => {
    return api.post<ApiResponse<LoginResponse>>('/api/user/oauth/login', data);
  },

  /**
   * 获取用户资料
   */
  getProfile: async (user_id: string) => {
    return api.get<ApiResponse<UserInfo>>(`/api/user/profile/${user_id}`);
  },

  /**
   * 更新用户资料
   */
  updateProfile: async (data: UpdateProfileRequest) => {
    return api.put<ApiResponse<UserInfo>>('/api/user/profile/update', data);
  },

  /**
   * 忘记密码
   */
  forgotPassword: async (data: ForgotPasswordRequest) => {
    return api.post<ApiResponse<{ success: boolean }>>('/api/user/password/forgot', data);
  },

  /**
   * 重置密码
   */
  resetPassword: async (data: ResetPasswordRequest) => {
    return api.post<ApiResponse<{ success: boolean }>>('/api/user/password/reset', data);
  },

  /**
   * 删除账号
   */
  deleteAccount: async (data: DeleteAccountRequest) => {
    return api.delete<ApiResponse<{ success: boolean }>>('/api/user/account/delete', { data });
  },

  /**
   * 获取用户列表
   */
  getUserList: async (query: UserListQuery) => {
    return api.get<ApiResponse<UserListResponse>>('/api/user/list', { params: query });
  },

  /**
   * 用户登出
   */
  logout: async (user_id: string, refresh_token: string) => {
    return api.post<ApiResponse<{ success: boolean }>>('/api/user/logout', {
      user_id,
      refresh_token,
    });
  },

  /**
   * 刷新令牌
   */
  refreshToken: async (refresh_token: string) => {
    return api.post<ApiResponse<LoginResponse>>('/api/user/token/refresh', { refresh_token });
  },

  /**
   * 获取用户订阅计划
   */
  getSubscription: async (user_id: string) => {
    return api.get<ApiResponse<SubscriptionInfo>>(`/api/user/subscription/${user_id}`);
  },

  /**
   * 更新用户订阅计划
   */
  updateSubscription: async (data: UpdateSubscriptionRequest) => {
    return api.put<ApiResponse<SubscriptionInfo>>('/api/user/subscription/update', data);
  },
};

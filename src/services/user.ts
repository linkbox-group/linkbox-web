import { api } from './api';

/**
 * 用户注册请求参数
 */
export interface RegisterRequest {
  email: string;
  phone?: string;
  password: string;
  username: string;
}

/**
 * 用户登录请求参数
 */
export interface LoginRequest {
  account: string; // 可以是邮箱或手机号
  password: string;
}

/**
 * 第三方登录请求参数
 */
export interface OAuthLoginRequest {
  code: string;
  redirectUri: string;
}

/**
 * 用户信息响应
 */
export interface UserInfo {
  userId: number;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  subscription?: {
    plan: string;
    expireDate: string;
  };
  stats?: {
    collectionCount: number;
    itemsCount: number;
    tagsCount: number;
  };
  createdAt: string;
}

/**
 * 更新用户信息请求参数
 */
export interface UpdateProfileRequest {
  username?: string;
  avatar?: string;
}

/**
 * 修改密码请求参数
 */
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

/**
 * 认证响应
 */
export interface AuthResponse {
  userId: number;
  username: string;
  email: string;
  token: string;
}

/**
 * 用户服务
 */
export const userService = {
  /**
   * 用户注册
   * @param data 注册信息
   * @returns 注册响应
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    return api.post<AuthResponse>('/auth/register', data);
  },

  /**
   * 用户登录
   * @param data 登录信息
   * @returns 登录响应
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return api.post<AuthResponse>('/auth/login', data);
  },

  /**
   * 第三方登录
   * @param platform 平台名称
   * @param data 登录信息
   * @returns 登录响应
   */
  oauthLogin: async (platform: string, data: OAuthLoginRequest): Promise<AuthResponse> => {
    return api.post<AuthResponse>(`/auth/oauth/${platform}`, data);
  },

  /**
   * 获取用户信息
   * @returns 用户信息
   */
  getProfile: async (): Promise<UserInfo> => {
    return api.get<UserInfo>('/user/profile');
  },

  /**
   * 更新用户信息
   * @param data 更新信息
   * @returns 更新后的用户信息
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<Partial<UserInfo>> => {
    return api.put<Partial<UserInfo>>('/user/profile', data);
  },

  /**
   * 修改密码
   * @param data 密码信息
   * @returns 修改结果
   */
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    return api.post<void>('/user/change-password', data);
  },

  /**
   * 退出登录
   */
  logout: (): void => {
    // 清除本地存储的令牌
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

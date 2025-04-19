/**
 * 用户状态
 */
export interface UserState {
  id: string;
  username: string;
  avatar?: string;
  email?: string;
  isLoggedIn: boolean;
}

/**
 * 应用设置
 */
export interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  language: 'zh-CN' | 'en-US';
  notification: boolean;
}

/**
 * 应用状态
 */
export interface AppState {
  isLoading: boolean;
  isMobile: boolean;
  sidebarCollapsed: boolean;
} 
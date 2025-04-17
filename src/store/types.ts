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

/**
 * 消息类型
 */
export interface Message {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  content: string;
  duration?: number;
}

/**
 * 全局状态类型
 */
export interface GlobalState {
  // 状态
  user: UserState;
  settings: SettingsState;
  app: AppState;
  messages: Message[];
  
  // 用户相关动作
  setUser: (user: Partial<UserState>) => void;
  logout: () => void;
  
  // 设置相关动作
  updateSettings: (settings: Partial<SettingsState>) => void;
  toggleTheme: () => void;
  setLanguage: (language: SettingsState['language']) => void;
  
  // 应用相关动作
  setLoading: (isLoading: boolean) => void;
  toggleSidebar: () => void;
  setIsMobile: (isMobile: boolean) => void;
  
  // 消息相关动作
  addMessage: (message: Omit<Message, 'id'>) => void;
  removeMessage: (id: string) => void;
  clearMessages: () => void;
} 
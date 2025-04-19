import { api } from './api';

/**
 * 排序字段
 */
export type SortField = 'createdAt' | 'updatedAt' | 'title';

/**
 * 排序顺序
 */
export type SortOrder = 'asc' | 'desc';

/**
 * 视图模式
 */
export type ViewMode = 'card' | 'list' | 'grid';

/**
 * 主题
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * 邮件摘要频率
 */
export type EmailDigestFrequency = 'daily' | 'weekly' | 'monthly';

/**
 * 显示偏好设置
 */
export interface DisplayPreferences {
  defaultViewMode: ViewMode;
  defaultSortBy: SortField;
  defaultSortOrder: SortOrder;
  itemsPerPage: number;
  theme: Theme;
}

/**
 * 通知设置
 */
export interface NotificationSettings {
  emailDigest: boolean;
  emailDigestFrequency: EmailDigestFrequency;
  browserNotification: boolean;
}

/**
 * 快捷键设置
 */
export interface ShortcutSettings {
  quickSave: string;
  quickSearch: string;
}

/**
 * 用户设置
 */
export interface UserSettings {
  displayPreferences: DisplayPreferences;
  notifications: NotificationSettings;
  shortcuts: ShortcutSettings;
}

/**
 * 更新用户设置请求参数
 */
export interface UpdateSettingsRequest {
  displayPreferences?: Partial<DisplayPreferences>;
  notifications?: Partial<NotificationSettings>;
  shortcuts?: Partial<ShortcutSettings>;
}

/**
 * 设置服务
 */
export const settingsService = {
  /**
   * 获取用户设置
   * @returns 用户设置
   */
  getSettings: async (): Promise<UserSettings> => {
    return api.get<UserSettings>('/settings');
  },

  /**
   * 更新用户设置
   * @param data 更新信息
   * @returns 更新后的用户设置
   */
  updateSettings: async (data: UpdateSettingsRequest): Promise<UserSettings> => {
    return api.put<UserSettings>('/settings', data);
  }
}; 
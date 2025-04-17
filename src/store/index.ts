import { create } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { GlobalState } from './types';
import { createUserSlice } from './slices/userSlice';
import { createSettingsSlice } from './slices/settingsSlice';
import { createAppSlice } from './slices/appSlice';
import { createMessageSlice } from './slices/messageSlice';

/**
 * 创建全局状态仓库
 */
const useStore = create<GlobalState>()(
  devtools(
    persist(
      immer((...a) => ({
        ...createUserSlice(...a),
        ...createSettingsSlice(...a),
        ...createAppSlice(...a),
        ...createMessageSlice(...a),
      })),
      {
        name: 'linkbox-store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          // 仅持久化用户偏好设置，不持久化用户敏感信息
          settings: state.settings,
        }),
      }
    )
  )
);

/**
 * 状态选择器
 */
export const useUser = () => useStore((state) => state.user);
export const useSettings = () => useStore((state) => state.settings);
export const useApp = () => useStore((state) => state.app);
export const useMessages = () => useStore((state) => state.messages);

/**
 * 动作选择器
 */
export const useUserActions = () => ({
  setUser: useStore((state) => state.setUser),
  logout: useStore((state) => state.logout),
});

export const useSettingsActions = () => ({
  updateSettings: useStore((state) => state.updateSettings),
  toggleTheme: useStore((state) => state.toggleTheme),
  setLanguage: useStore((state) => state.setLanguage),
});

export const useAppActions = () => ({
  setLoading: useStore((state) => state.setLoading),
  toggleSidebar: useStore((state) => state.toggleSidebar),
  setIsMobile: useStore((state) => state.setIsMobile),
});

export const useMessageActions = () => ({
  addMessage: useStore((state) => state.addMessage),
  removeMessage: useStore((state) => state.removeMessage),
  clearMessages: useStore((state) => state.clearMessages),
});

// 默认导出整个状态仓库
export default useStore;

import { create } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { useUserStore } from './userStore';
import { useSettingsStore } from './settingsStore';
import { useAppStore } from './appStore';

// 导出所有store
export { useUserStore } from './userStore';
export { useSettingsStore } from './settingsStore';
export { useAppStore } from './appStore';

// 导出actions
export const useUserActions = () => ({
  setUser: useUserStore((state) => state.setUser),
  logout: useUserStore((state) => state.logout),
});

export const useSettingsActions = () => ({
  updateSettings: useSettingsStore((state) => state.updateSettings),
  toggleTheme: useSettingsStore((state) => state.toggleTheme),
  setLanguage: useSettingsStore((state) => state.setLanguage),
});

export const useAppActions = () => ({
  setLoading: useAppStore((state) => state.setLoading),
  toggleSidebar: useAppStore((state) => state.toggleSidebar),
  setIsMobile: useAppStore((state) => state.setIsMobile),
});

import { StateCreator } from "zustand";
import { GlobalState, AppState } from "../types";

/**
 * 应用状态切片
 */
export const createAppSlice: StateCreator<
  GlobalState,
  [],
  [],
  {
    app: AppState;
    setLoading: (isLoading: boolean) => void;
    toggleSidebar: () => void;
    setIsMobile: (isMobile: boolean) => void;
  }
> = (set) => ({
  // 应用状态初始状态
  app: {
    isLoading: false,
    isMobile: false,
    sidebarCollapsed: false,
  },

  // 设置加载状态
  setLoading: (isLoading) =>
    set((state) => ({
      app: {
        ...state.app,
        isLoading,
      },
    })),

  // 切换侧边栏
  toggleSidebar: () =>
    set((state) => ({
      app: {
        ...state.app,
        sidebarCollapsed: !state.app.sidebarCollapsed,
      },
    })),

  // 设置移动设备状态
  setIsMobile: (isMobile) =>
    set((state) => ({
      app: {
        ...state.app,
        isMobile,
      },
    })),
});

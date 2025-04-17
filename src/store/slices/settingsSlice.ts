import { StateCreator } from "zustand";
import { GlobalState, SettingsState } from "../types";

/**
 * 设置状态切片
 */
export const createSettingsSlice: StateCreator<
  GlobalState,
  [],
  [],
  {
    settings: SettingsState;
    updateSettings: (settings: Partial<SettingsState>) => void;
    toggleTheme: () => void;
    setLanguage: (language: SettingsState["language"]) => void;
  }
> = (set) => ({
  // 应用设置初始状态
  settings: {
    theme: "system",
    language: "zh-CN",
    notification: true,
  },

  // 更新设置
  updateSettings: (settings: Partial<SettingsState>) =>
    set((state) => ({
      settings: {
        ...state.settings,
        ...settings,
      },
    })),

  // 切换主题
  toggleTheme: () =>
    set((state) => {
      const currentTheme = state.settings.theme;
      let newTheme: SettingsState["theme"];

      if (currentTheme === "light") {
        newTheme = "dark";
      } else if (currentTheme === "dark") {
        newTheme = "system";
      } else {
        newTheme = "light";
      }

      return {
        settings: {
          ...state.settings,
          theme: newTheme,
        },
      };
    }),

  // 设置语言
  setLanguage: (language: SettingsState["language"]) =>
    set((state) => ({
      settings: {
        ...state.settings,
        language,
      },
    })),
});

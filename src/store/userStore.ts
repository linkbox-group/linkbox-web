import { create } from "zustand";
import { UserState } from "./types";

interface UserStore {
  user: UserState;
  setUser: (user: Partial<UserState>) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  // 用户信息初始状态
  user: {
    id: "",
    username: "",
    avatar: "",
    email: "",
    isLoggedIn: false,
  },

  // 设置用户信息
  setUser: (user: Partial<UserState>) =>
    set((state) => ({
      user: {
        ...state.user,
        ...user,
        isLoggedIn: Object.keys(user).length > 0 ? true : state.user.isLoggedIn,
      },
    })),

  // 退出登录
  logout: () =>
    set(() => ({
      user: {
        id: "",
        username: "",
        avatar: "",
        email: "",
        isLoggedIn: false,
      },
    })),
})); 
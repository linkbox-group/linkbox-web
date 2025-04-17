import { StateCreator } from "zustand";
import { GlobalState, UserState } from "../types";

/**
 * 用户状态切片
 */
export const createUserSlice: StateCreator<
  GlobalState,
  [],
  [],
  {
    user: UserState;
    setUser: (user: Partial<UserState>) => void;
    logout: () => void;
  }
> = (set) => ({
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
});

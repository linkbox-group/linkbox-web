import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ApiResponse } from "@/services/api";
import { TokenManager } from "@/services/api";

export interface UserState {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  theme?: string;
  isLoggedIn: boolean;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface UserStore {
  user: UserState;
  tokens: AuthTokens | null;
  setUser: (user: Partial<UserState>) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  logout: () => void;
  login: (
    response: ApiResponse<{
      user_id: string;
      username: string;
      email: string;
      avatar?: string;
      bio?: string;
      theme?: string;
      access_token: string;
      refresh_token: string;
    }>
  ) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: {
        id: "",
        username: "",
        email: "",
        isLoggedIn: false,
      },
      tokens: null,
      setUser: (user) =>
        set((state) => ({
          user: { ...state.user, ...user },
        })),
      setTokens: (tokens) =>
        set(() => ({
          tokens,
        })),
      logout: () => {
        TokenManager.clearTokens();
        set(() => ({
          user: {
            id: "",
            username: "",
            email: "",
            isLoggedIn: false,
          },
          tokens: null,
        }));
      },
      login: (response) => {
        const { data } = response;
        const {
          user_id,
          username,
          email,
          avatar,
          bio,
          theme,
          access_token,
          refresh_token,
        } = data;

        // 使用 TokenManager 设置 token
        TokenManager.setAuthInfo(access_token, refresh_token);

        // 更新 store
        set(() => ({
          user: {
            id: user_id,
            username,
            email,
            avatar,
            bio,
            theme,
            isLoggedIn: true,
          },
        }));
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
      }),
    }
  )
);

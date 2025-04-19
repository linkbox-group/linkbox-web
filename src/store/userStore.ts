import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserState {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  roles?: string[];
  createdAt?: string;
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
  login: (response: any) => void;
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
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
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
        const { access_token, refresh_token, expires_in, user } = response.data;
        
        // 保存 token 到 localStorage
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        
        // 更新 store
        set(() => ({
          tokens: {
            accessToken: access_token,
            refreshToken: refresh_token,
            expiresIn: expires_in,
          },
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            displayName: user.display_name,
            avatarUrl: user.avatar_url,
            roles: user.roles,
            createdAt: user.created_at,
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
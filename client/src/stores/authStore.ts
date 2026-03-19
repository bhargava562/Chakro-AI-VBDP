import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthTokens, Role } from '@/types';

interface AuthStore {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: User) => void;
  setTokens: (tokens: AuthTokens) => void;
  login: (user: User, tokens: AuthTokens) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  hasRole: (role: Role) => boolean;
  isTokenExpired: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user }),

      setTokens: (tokens) => set({ tokens }),

      login: (user, tokens) =>
        set({
          user,
          tokens,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      setLoading: (isLoading) => set({ isLoading }),

      hasRole: (role) => {
        const { user } = get();
        if (!user) return false;
        const hierarchy: Record<Role, number> = { owner: 3, manager: 2, analyst: 1 };
        return hierarchy[user.role] >= hierarchy[role];
      },

      isTokenExpired: () => {
        const { tokens } = get();
        if (!tokens) return true;
        return Date.now() >= tokens.expiresAt;
      },
    }),
    {
      name: 'chakro-auth',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

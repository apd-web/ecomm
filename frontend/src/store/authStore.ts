import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { AuthUser } from "../services/authApi";

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  setSession: (user: AuthUser, accessToken: string) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setSession: (user, accessToken) => set({ user, accessToken }),
      clear: () => set({ user: null, accessToken: null }),
    }),
    { name: "ecomm-auth" },
  ),
);

export const getAuthState = () => useAuthStore.getState();

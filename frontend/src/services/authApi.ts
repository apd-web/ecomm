import type { ApiResponse } from "./apiClient";

import { apiClient } from "./apiClient";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  roles: string[];
  provider: string;
  emailVerified: boolean;
};

export type AuthSession = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

export type UserSession = {
  id: string;
  userAgent?: string;
  ip?: string;
  createdAt: string;
  lastUsedAt?: string;
  expiresAt: string;
  revokedAt?: string;
};

export const authApi = {
  login: async (payload: { email: string; password: string }) => {
    const response = await apiClient.post<ApiResponse<AuthSession>>("/auth/login", payload);
    return response.data.data;
  },
  register: async (payload: { name: string; email: string; password: string }) => {
    const response = await apiClient.post<ApiResponse<AuthSession>>("/auth/register", payload);
    return response.data.data;
  },
  logout: async () => {
    await apiClient.post("/auth/logout", {});
  },
  me: async () => {
    const response = await apiClient.get<ApiResponse<{ user: AuthUser }>>("/auth/me");
    return response.data.data.user;
  },
  listSessions: async () => {
    const response =
      await apiClient.get<ApiResponse<{ sessions: UserSession[] }>>("/auth/sessions");
    return response.data.data.sessions;
  },
  revokeSession: async (sessionId: string) => {
    await apiClient.delete(`/auth/sessions/${sessionId}`);
  },
  revokeAllSessions: async () => {
    await apiClient.delete("/auth/sessions");
  },
  getOAuthLinkUrl: async (provider: "google" | "github", redirectPath = "/profile") => {
    const response = await apiClient.get<ApiResponse<{ url: string }>>(
      `/auth/oauth/${provider}/link/start`,
      {
        params: {
          mode: "json",
          redirect: redirectPath,
        },
      },
    );
    return response.data.data.url;
  },
  unlinkOAuth: async (provider: "google" | "github") => {
    await apiClient.delete(`/auth/oauth/${provider}/unlink`);
  },
};

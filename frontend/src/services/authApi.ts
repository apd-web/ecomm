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
};

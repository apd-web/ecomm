import axios from "axios";

import { getAuthState } from "../store/authStore";

type ApiResponse<T> = {
  data: T;
  meta?: Record<string, unknown>;
};

const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api/v1";

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthState().accessToken;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type { ApiResponse };

import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { authMockService } from "@/features/auth/services/auth.mock";
import { STORAGE_KEYS } from "@/features/auth/constants";
import { ApiError } from "@/types/api";
import { isMockEnabled, mockAdapter } from "./mock/adapter";
import "./mock/mocks";

type AuthBridge = {
  getAccessToken: () => string | null;
  refresh: () => Promise<string>;
};

let authBridge: AuthBridge = {
  getAccessToken: () =>
    typeof window !== "undefined"
      ? window.localStorage.getItem(STORAGE_KEYS.accessToken)
      : null,
  refresh: async () => {
    const refreshToken = window.localStorage.getItem(STORAGE_KEYS.refreshToken);
    if (!refreshToken) throw new Error("No refresh token available.");
    const { access } = await authMockService.refresh(refreshToken);
    window.localStorage.setItem(STORAGE_KEYS.accessToken, access);
    return access;
  },
};

export function setAuthBridge(bridge: AuthBridge) {
  authBridge = bridge;
}

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

export const http: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE ?? "/api/v1",
  adapter: isMockEnabled() ? mockAdapter : undefined,
});

http.interceptors.request.use((config) => {
  const token = authBridge.getAccessToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryableConfig | undefined;
    const shouldRetry =
      error.response?.status === 401 &&
      !!config &&
      !config._retried &&
      !String(config.url).startsWith("/auth/");

    if (shouldRetry) {
      config._retried = true;
      try {
        const nextToken = await authBridge.refresh();
        config.headers.set("Authorization", `Bearer ${nextToken}`);
        return http.request(config);
      } catch {
        window.dispatchEvent(new Event("gv:unauthorized"));
      }
    }
    return Promise.reject(toApiError(error));
  }
);

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 0;
    const data = error.response?.data;
    let detail = error.message ?? "Network error.";
    let fields: Record<string, string[]> = {};
    if (data && typeof data === "object") {
      const record = data as Record<string, unknown>;
      if ("detail" in record && typeof record.detail === "string") {
        detail = record.detail;
      }
      if ("fields" in record && record.fields) {
        fields = record.fields as Record<string, string[]>;
      }
    }
    return new ApiError(status, detail, fields);
  }
  if (error instanceof Error) return new ApiError(0, error.message, {});
  return new ApiError(0, "Unknown error.", {});
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

function extractMessage(error: unknown): string {
  return toApiError(error).message;
}

/** Human-readable message incl. field errors, e.g. for form submit toasts. */
export function toErrorMessage(error: unknown): string {
  const apiError = toApiError(error);
  const fieldMessages = Object.values(apiError.fields ?? {}).flat();
  return fieldMessages.length > 0
    ? fieldMessages.join("; ")
    : apiError.message || "Something went wrong.";
}

async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await http.request<T>(config);
  return response.data;
}

export const api = {
  get: <T>(url: string, params?: unknown) =>
    request<T>({ method: "get", url, params }),
  post: <T>(url: string, payload?: unknown) =>
    request<T>({ method: "post", url, data: payload }),
  patch: <T>(url: string, payload?: unknown) =>
    request<T>({ method: "patch", url, data: payload }),
  del: <T>(url: string) => request<T>({ method: "delete", url }),
};

export { extractMessage };
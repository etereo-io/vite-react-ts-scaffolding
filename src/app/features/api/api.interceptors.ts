import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig
} from "axios";
import { getAccessToken, setAccessToken } from "@/app/features/auth/auth.token";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null): void {
  for (const promise of failedQueue) {
    if (token) {
      promise.resolve(token);
    } else {
      promise.reject(error);
    }
  }
  failedQueue = [];
}

async function refreshAccessToken(): Promise<string> {
  // Placeholder: replace with actual refresh endpoint call
  const response = await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include"
  });

  if (!response.ok) {
    throw new Error("Token refresh failed");
  }

  const data = (await response.json()) as { accessToken: string };
  return data.accessToken;
}

export function setupRequestInterceptor(instance: AxiosInstance): void {
  instance.interceptors.request.use(function onRequestFulfilled(
    config: InternalAxiosRequestConfig
  ): InternalAxiosRequestConfig {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });
}

export function setupResponseInterceptor(instance: AxiosInstance): void {
  instance.interceptors.response.use(
    undefined,
    async function onResponseRejected(error: AxiosError): Promise<unknown> {
      const originalRequest = error.config as
        | (InternalAxiosRequestConfig & { _retry?: boolean })
        | undefined;

      if (
        error.response?.status !== 401 ||
        !originalRequest ||
        originalRequest._retry
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return instance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        setAccessToken(newToken);
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );
}

/**
 * Resets the internal refresh state. Intended for testing only.
 */
export function resetInterceptorState(): void {
  isRefreshing = false;
  failedQueue = [];
}

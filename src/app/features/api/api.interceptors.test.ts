import axios from "axios";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  clearAccessToken,
  setAccessToken
} from "@/app/features/auth/auth.token";
import {
  resetInterceptorState,
  setupRequestInterceptor,
  setupResponseInterceptor
} from "./api.interceptors";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createTestInstance() {
  const instance = axios.create();
  setupRequestInterceptor(instance);
  setupResponseInterceptor(instance);
  return instance;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("api interceptors", () => {
  beforeEach(() => {
    clearAccessToken();
    resetInterceptorState();
  });

  afterEach(() => {
    clearAccessToken();
    resetInterceptorState();
    vi.restoreAllMocks();
  });

  // -----------------------------------------------------------------------
  // Request interceptor
  // -----------------------------------------------------------------------

  describe("request interceptor", () => {
    test("attaches Authorization header when token exists", async () => {
      const instance = createTestInstance();

      setAccessToken("my-access-token");

      const adapter = vi.fn().mockResolvedValue({
        data: {},
        status: 200,
        statusText: "OK",
        headers: {},
        config: {}
      });
      instance.defaults.adapter = adapter;

      await instance.get("/test");

      const requestConfig = adapter.mock.calls[0][0];
      expect(requestConfig.headers.Authorization).toBe(
        "Bearer my-access-token"
      );
    });

    test("does not attach Authorization header when no token is set", async () => {
      const instance = createTestInstance();

      const adapter = vi.fn().mockResolvedValue({
        data: {},
        status: 200,
        statusText: "OK",
        headers: {},
        config: {}
      });
      instance.defaults.adapter = adapter;

      await instance.get("/test");

      const requestConfig = adapter.mock.calls[0][0];
      expect(requestConfig.headers.Authorization).toBeUndefined();
    });
  });

  // -----------------------------------------------------------------------
  // Response interceptor
  // -----------------------------------------------------------------------

  describe("response interceptor", () => {
    test("passes through successful responses unchanged", async () => {
      const instance = createTestInstance();

      const adapter = vi.fn().mockResolvedValue({
        data: { ok: true },
        status: 200,
        statusText: "OK",
        headers: {},
        config: {}
      });
      instance.defaults.adapter = adapter;

      const response = await instance.get("/test");
      expect(response.data).toEqual({ ok: true });
    });

    test("rejects non-401 errors without attempting refresh", async () => {
      const instance = createTestInstance();
      const fetchSpy = vi.spyOn(globalThis, "fetch");

      const adapter = vi.fn().mockRejectedValue({
        response: { status: 500 },
        config: { headers: {} },
        isAxiosError: true
      });
      instance.defaults.adapter = adapter;

      await expect(instance.get("/test")).rejects.toBeDefined();
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    test("attempts token refresh on 401 and retries the original request", async () => {
      const instance = createTestInstance();

      const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
        new Response(JSON.stringify({ accessToken: "refreshed-token" }), {
          status: 200
        })
      );

      let callCount = 0;
      const adapter = vi.fn().mockImplementation((config) => {
        callCount++;
        if (callCount === 1) {
          // First call: simulate 401
          const error = new Error("Unauthorized") as Error & {
            response: { status: number };
            config: typeof config;
            isAxiosError: boolean;
          };
          error.response = { status: 401 };
          error.config = config;
          error.isAxiosError = true;
          return Promise.reject(error);
        }
        // Retry call: succeed
        return Promise.resolve({
          data: { retried: true },
          status: 200,
          statusText: "OK",
          headers: {},
          config
        });
      });
      instance.defaults.adapter = adapter;

      setAccessToken("expired-token");

      const response = await instance.get("/test");

      expect(fetchSpy).toHaveBeenCalledWith("/api/auth/refresh", {
        method: "POST",
        credentials: "include"
      });
      expect(response.data).toEqual({ retried: true });
      expect(adapter).toHaveBeenCalledTimes(2);
    });

    test("queues concurrent requests during token refresh", async () => {
      const instance = createTestInstance();

      let resolveRefresh: ((value: Response) => void) | undefined;
      vi.spyOn(globalThis, "fetch").mockImplementation(() => {
        return new Promise<Response>((resolve) => {
          resolveRefresh = resolve;
        });
      });

      let callCount = 0;
      const adapter = vi.fn().mockImplementation((config) => {
        callCount++;
        if (callCount <= 2) {
          // First two calls: simulate 401
          const error = new Error("Unauthorized") as Error & {
            response: { status: number };
            config: typeof config;
            isAxiosError: boolean;
          };
          error.response = { status: 401 };
          error.config = { ...config, _retry: false };
          error.isAxiosError = true;
          return Promise.reject(error);
        }
        // Retry calls: succeed
        return Promise.resolve({
          data: { retried: true, callCount },
          status: 200,
          statusText: "OK",
          headers: {},
          config
        });
      });
      instance.defaults.adapter = adapter;

      setAccessToken("expired-token");

      const promise1 = instance.get("/first");
      const promise2 = instance.get("/second");

      // Wait a tick for both requests to fail and enqueue
      await new Promise((r) => setTimeout(r, 10));

      // Resolve the refresh - only one refresh call should have been made
      resolveRefresh?.(
        new Response(JSON.stringify({ accessToken: "new-token" }), {
          status: 200
        })
      );

      const [response1, response2] = await Promise.all([promise1, promise2]);

      expect(response1.data.retried).toBe(true);
      expect(response2.data.retried).toBe(true);
      // fetch should have been called only once for the refresh
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });

    test("rejects all queued requests when token refresh fails", async () => {
      const instance = createTestInstance();

      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
        new Response("Forbidden", { status: 403 })
      );

      let _callCount = 0;
      const adapter = vi.fn().mockImplementation((config) => {
        _callCount++;
        const error = new Error("Unauthorized") as Error & {
          response: { status: number };
          config: typeof config;
          isAxiosError: boolean;
        };
        error.response = { status: 401 };
        error.config = config;
        error.isAxiosError = true;
        return Promise.reject(error);
      });
      instance.defaults.adapter = adapter;

      setAccessToken("expired-token");

      await expect(instance.get("/test")).rejects.toBeDefined();
    });
  });
});

import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { isMswEnabled } from "@/app/features/config/config.helpers";

import { mockServerConfig } from "../constants";

const MSW_STARTUP_TIMEOUT = 5000;

export interface MockLoadingState {
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly error: Error | null;
}

export interface MockProviderProps {
  readonly children: React.ReactNode;
  readonly enabled?: boolean;
}

export function MockProvider({ children, enabled }: MockProviderProps) {
  const [loadingState, setLoadingState] = useState<MockLoadingState>({
    isLoading: false,
    isError: false,
    error: null
  });
  const startedRef = useRef(false);

  const shouldEnableMocking = enabled ?? isMswEnabled();

  const startMockServer = useCallback(async () => {
    if (!shouldEnableMocking) {
      return;
    }

    // StrictMode guard: prevent double-start in development
    if (startedRef.current) {
      return;
    }
    startedRef.current = true;

    setLoadingState({
      isLoading: true,
      isError: false,
      error: null
    });

    try {
      const { worker } = await import("@/app/features/mock-server/browser");

      // Race the worker start against a timeout so the app is not blocked forever
      await Promise.race([
        worker.start(mockServerConfig),
        new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error("MSW startup timed out")),
            MSW_STARTUP_TIMEOUT
          )
        )
      ]);

      setLoadingState({
        isLoading: false,
        isError: false,
        error: null
      });
    } catch (error) {
      const mockError =
        error instanceof Error ? error : new Error("Unknown mock server error");

      console.error("Mock server failed to start:", mockError);

      setLoadingState({
        isLoading: false,
        isError: true,
        error: mockError
      });
    }
  }, [shouldEnableMocking]);

  // Start mock server only once when the component mounts
  useEffect(() => {
    let cancelled = false;

    async function start() {
      await startMockServer();

      // If the effect was cleaned up while we were awaiting (StrictMode unmount),
      // reset the guard so a subsequent mount can retry.
      if (cancelled) {
        startedRef.current = false;
      }
    }

    start();

    return () => {
      cancelled = true;
    };
  }, [startMockServer]);

  // If mocking is disabled, render children immediately
  if (!shouldEnableMocking) {
    return <>{children}</>;
  }

  // Show loading state while starting mock server
  if (loadingState.isLoading) {
    return <div>Starting mock server...</div>;
  }

  // Show error state if mock server failed to start
  if (loadingState.isError) {
    // Continue rendering children even if mock server fails
    return <>{children}</>;
  }

  return <>{children}</>;
}

import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useConfig } from "../../config/providers/ConfigProvider";
import { mockServerConfig } from "../constants";

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
  const { config } = useConfig();
  const [loadingState, setLoadingState] = useState<MockLoadingState>({
    isLoading: false,
    isError: false,
    error: null
  });

  const shouldEnableMocking = enabled ?? config?.features?.msw ?? true;

  const startMockServer = useCallback(async () => {
    if (!shouldEnableMocking) {
      return;
    }

    setLoadingState({
      isLoading: true,
      isError: false,
      error: null
    });

    try {
      const { worker } = await import("@/app/features/mock-server/browser");
      await worker.start(mockServerConfig);

      setLoadingState({
        isLoading: false,
        isError: false,
        error: null
      });
    } catch (error) {
      const mockError =
        error instanceof Error ? error : new Error("Unknown mock server error");

      setLoadingState({
        isLoading: false,
        isError: true,
        error: mockError
      });
    }
  }, [shouldEnableMocking]);

  // Start mock server only once when the component mounts
  useEffect(() => {
    startMockServer();
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
    console.error("Mock server failed to start:", loadingState.error);
    // Continue rendering children even if mock server fails
    return <>{children}</>;
  }

  return <>{children}</>;
}

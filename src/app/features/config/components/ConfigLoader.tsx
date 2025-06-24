import type React from "react";
import { useConfig } from "../providers/ConfigProvider";

interface Props {
  readonly children: React.ReactNode;
  readonly loadingComponent?: React.ReactNode;
  readonly errorComponent?: React.ReactNode;
}

export function ConfigLoader({
  children,
  loadingComponent,
  errorComponent
}: Props) {
  const configStatus = useConfig();

  // Show loading state
  if (configStatus.loadingState.isLoading) {
    return (
      <>
        {loadingComponent || (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading configuration...</p>
            </div>
          </div>
        )}
      </>
    );
  }

  // Show error state with retry option
  if (configStatus.loadingState.error) {
    return (
      <>
        {errorComponent || (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center max-w-md mx-auto p-6">
              <div className="text-red-600 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <title>Configuration error icon</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Configuration Error
              </h2>
              <p className="text-gray-600 mb-4">
                Failed to load application configuration.
                {configStatus.loadingState.error?.message && (
                  <span className="block mt-2 text-sm text-gray-500">
                    {configStatus.loadingState.error.message}
                  </span>
                )}
              </p>
            </div>
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
}

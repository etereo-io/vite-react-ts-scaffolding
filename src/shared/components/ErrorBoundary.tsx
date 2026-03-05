import type { ReactNode } from "react";
import {
  type ErrorBoundaryPropsWithFallback,
  ErrorBoundary as ReactErrorBoundary
} from "react-error-boundary";

import { Error500 } from "./Error500";

type ErrorBoundaryProps = Omit<
  ErrorBoundaryPropsWithFallback,
  "fallback" | "FallbackComponent" | "fallbackRender"
> & {
  readonly fallback?: ErrorBoundaryPropsWithFallback["fallback"];
  readonly children: ReactNode;
  readonly error?: unknown;
};

export function ErrorBoundary({
  fallback = <Error500 />,
  children,
  error,
  ...props
}: ErrorBoundaryProps) {
  if (error) {
    return <>{fallback}</>;
  }

  return (
    <ReactErrorBoundary fallback={fallback} {...props}>
      {children}
    </ReactErrorBoundary>
  );
}

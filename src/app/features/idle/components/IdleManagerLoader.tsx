import { useIdleManager } from "../hooks/useIdleManager";

interface IdleManagerLoaderProps {
  readonly children: React.ReactNode;
}

/**
 * Activates idle detection for pausing query polling.
 * Must be placed as a child of QueryClientProvider.
 */
export function IdleManagerLoader({ children }: IdleManagerLoaderProps) {
  useIdleManager();
  return <>{children}</>;
}

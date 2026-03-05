import { useCallback, useRef } from "react";

export function useCallbackRef<T extends (...args: unknown[]) => unknown>(
  callback: T | undefined
): T {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  return useCallback(
    (...args: unknown[]) => callbackRef.current?.(...args),
    []
  ) as T;
}

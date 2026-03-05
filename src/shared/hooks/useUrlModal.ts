import { useCallback } from "react";
import { useSearchParams } from "react-router";

export function useUrlModal(paramName: string) {
  const [searchParams, setSearchParams] = useSearchParams();
  const isOpen = searchParams.has(paramName);
  const value = searchParams.get(paramName);

  const open = useCallback(
    (val?: string) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set(paramName, val ?? "true");
        return next;
      });
    },
    [paramName, setSearchParams]
  );

  const close = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete(paramName);
      return next;
    });
  }, [paramName, setSearchParams]);

  return { isOpen, value, open, close };
}

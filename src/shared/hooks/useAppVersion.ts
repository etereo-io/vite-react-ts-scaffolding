import { useMemo } from "react";

export function useAppVersion(): string {
  return useMemo(() => {
    if (typeof document === "undefined") return "0.0.0-unknown";
    const meta = document.querySelector('meta[name="app-version"]');
    return meta?.getAttribute("content") ?? "0.0.0-unknown";
  }, []);
}

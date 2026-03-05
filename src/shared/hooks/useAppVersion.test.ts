import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useAppVersion } from "./useAppVersion";

describe("useAppVersion", () => {
  afterEach(() => {
    const meta = document.querySelector('meta[name="app-version"]');
    if (meta) meta.remove();
  });

  it("should return fallback version when no meta tag exists", () => {
    const { result } = renderHook(() => useAppVersion());
    expect(result.current).toBe("0.0.0-unknown");
  });

  it("should return version from meta tag", () => {
    const meta = document.createElement("meta");
    meta.setAttribute("name", "app-version");
    meta.setAttribute("content", "1.2.3");
    document.head.appendChild(meta);

    const { result } = renderHook(() => useAppVersion());
    expect(result.current).toBe("1.2.3");
  });

  it("should return fallback when meta tag has no content attribute", () => {
    const meta = document.createElement("meta");
    meta.setAttribute("name", "app-version");
    document.head.appendChild(meta);

    const { result } = renderHook(() => useAppVersion());
    expect(result.current).toBe("0.0.0-unknown");
  });
});

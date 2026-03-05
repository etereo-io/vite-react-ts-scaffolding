import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useCallbackRef } from "./useCallbackRef";

describe("useCallbackRef", () => {
  it("should return a stable function reference", () => {
    const callback = vi.fn();
    const { result, rerender } = renderHook(({ cb }) => useCallbackRef(cb), {
      initialProps: { cb: callback }
    });

    const firstRef = result.current;
    rerender({ cb: callback });
    expect(result.current).toBe(firstRef);
  });

  it("should call the latest callback", () => {
    const firstCallback = vi.fn();
    const secondCallback = vi.fn();

    const { result, rerender } = renderHook(({ cb }) => useCallbackRef(cb), {
      initialProps: { cb: firstCallback }
    });

    rerender({ cb: secondCallback });
    result.current("test-arg");

    expect(firstCallback).not.toHaveBeenCalled();
    expect(secondCallback).toHaveBeenCalledWith("test-arg");
  });

  it("should handle undefined callback without throwing", () => {
    const { result } = renderHook(() => useCallbackRef(undefined));
    expect(() => result.current("arg")).not.toThrow();
  });
});

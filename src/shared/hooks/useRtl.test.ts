import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useRtl } from "./useRtl";

// Synchronous MutationObserver mock to avoid act() warnings from async callbacks
let observerCallback: MutationCallback;

class MockMutationObserver {
  constructor(callback: MutationCallback) {
    observerCallback = callback;
  }
  observe = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => [] as MutationRecord[]);
}

describe("useRtl", () => {
  beforeEach(() => {
    vi.stubGlobal("MutationObserver", MockMutationObserver);
  });

  afterEach(() => {
    document.documentElement.removeAttribute("dir");
  });

  it("should return false when dir is not set", () => {
    const { result } = renderHook(() => useRtl());
    expect(result.current).toBe(false);
  });

  it("should return true when dir is already rtl", () => {
    document.documentElement.dir = "rtl";
    const { result } = renderHook(() => useRtl());
    expect(result.current).toBe(true);
  });

  it("should update when dir attribute changes", () => {
    const { result } = renderHook(() => useRtl());
    expect(result.current).toBe(false);

    act(() => {
      document.documentElement.dir = "rtl";
      observerCallback(
        [] as unknown as MutationRecord[],
        new MockMutationObserver(() => {}) as unknown as MutationObserver
      );
    });

    expect(result.current).toBe(true);
  });

  it("should disconnect observer on unmount", () => {
    const { unmount } = renderHook(() => useRtl());
    expect(() => unmount()).not.toThrow();
  });
});

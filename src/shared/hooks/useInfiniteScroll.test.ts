import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useInfiniteScroll } from "./useInfiniteScroll";

describe("useInfiniteScroll", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "IntersectionObserver",
      vi.fn(() => ({
        observe: vi.fn(),
        disconnect: vi.fn(),
        unobserve: vi.fn()
      }))
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should return a sentinelRef callback", () => {
    const onLoadMore = vi.fn();
    const { result } = renderHook(() =>
      useInfiniteScroll({ onLoadMore, hasMore: true, isLoading: false })
    );
    expect(typeof result.current.sentinelRef).toBe("function");
  });

  it("should not call onLoadMore when isLoading is true", () => {
    const onLoadMore = vi.fn();
    renderHook(() =>
      useInfiniteScroll({ onLoadMore, hasMore: true, isLoading: true })
    );
    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it("should not call onLoadMore when hasMore is false", () => {
    const onLoadMore = vi.fn();
    renderHook(() =>
      useInfiniteScroll({ onLoadMore, hasMore: false, isLoading: false })
    );
    expect(onLoadMore).not.toHaveBeenCalled();
  });
});

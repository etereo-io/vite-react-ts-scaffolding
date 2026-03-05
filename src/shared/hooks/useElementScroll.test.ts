import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useElementScroll } from "./useElementScroll";

describe("useElementScroll", () => {
  it("should return initial scroll position as zeros", () => {
    const ref = { current: null };
    const { result } = renderHook(() => useElementScroll(ref));

    expect(result.current).toEqual({
      scrollTop: 0,
      scrollLeft: 0,
      scrollHeight: 0,
      scrollWidth: 0,
      clientHeight: 0,
      clientWidth: 0
    });
  });

  it("should read scroll values from element on mount", () => {
    const element = document.createElement("div");
    Object.defineProperties(element, {
      scrollTop: { value: 100, writable: true },
      scrollLeft: { value: 50, writable: true },
      scrollHeight: { value: 1000, writable: true },
      scrollWidth: { value: 800, writable: true },
      clientHeight: { value: 500, writable: true },
      clientWidth: { value: 400, writable: true }
    });

    const ref = { current: element };
    const { result } = renderHook(() => useElementScroll(ref));

    expect(result.current.scrollTop).toBe(100);
    expect(result.current.scrollLeft).toBe(50);
    expect(result.current.scrollHeight).toBe(1000);
    expect(result.current.scrollWidth).toBe(800);
    expect(result.current.clientHeight).toBe(500);
    expect(result.current.clientWidth).toBe(400);
  });

  it("should update when element fires scroll event", () => {
    const element = document.createElement("div");
    Object.defineProperties(element, {
      scrollTop: { value: 0, writable: true },
      scrollLeft: { value: 0, writable: true },
      scrollHeight: { value: 1000, writable: true },
      scrollWidth: { value: 800, writable: true },
      clientHeight: { value: 500, writable: true },
      clientWidth: { value: 400, writable: true }
    });

    const ref = { current: element };
    const { result } = renderHook(() => useElementScroll(ref));

    act(() => {
      Object.defineProperty(element, "scrollTop", {
        value: 200,
        writable: true
      });
      element.dispatchEvent(new Event("scroll"));
    });

    expect(result.current.scrollTop).toBe(200);
  });

  it("should clean up scroll listener on unmount", () => {
    const element = document.createElement("div");
    const removeEventListenerSpy = vi.spyOn(element, "removeEventListener");

    const ref = { current: element };
    const { unmount } = renderHook(() => useElementScroll(ref));

    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );
  });
});

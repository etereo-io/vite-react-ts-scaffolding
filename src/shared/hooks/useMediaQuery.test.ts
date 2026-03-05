import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useMediaQuery } from "./useMediaQuery";

describe("useMediaQuery", () => {
  let listeners: Map<string, ((event: MediaQueryListEvent) => void)[]>;
  let mediaQueryMatches: Map<string, boolean>;

  beforeEach(() => {
    listeners = new Map();
    mediaQueryMatches = new Map();

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => {
        if (!listeners.has(query)) listeners.set(query, []);
        return {
          matches: mediaQueryMatches.get(query) ?? false,
          media: query,
          addEventListener: vi.fn(
            (_event: string, handler: (event: MediaQueryListEvent) => void) => {
              listeners.get(query)?.push(handler);
            }
          ),
          removeEventListener: vi.fn(
            (_event: string, handler: (event: MediaQueryListEvent) => void) => {
              const queryListeners = listeners.get(query);
              if (queryListeners) {
                const index = queryListeners.indexOf(handler);
                if (index > -1) queryListeners.splice(index, 1);
              }
            }
          ),
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn()
        };
      })
    });
  });

  afterEach(() => {
    listeners.clear();
    mediaQueryMatches.clear();
  });

  it("should return false when query does not match", () => {
    mediaQueryMatches.set("(max-width: 768px)", false);
    const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));
    expect(result.current).toBe(false);
  });

  it("should return true when query matches", () => {
    mediaQueryMatches.set("(max-width: 768px)", true);
    const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));
    expect(result.current).toBe(true);
  });

  it("should update when media query changes", () => {
    mediaQueryMatches.set("(max-width: 768px)", false);
    const { result } = renderHook(() => useMediaQuery("(max-width: 768px)"));
    expect(result.current).toBe(false);

    const queryListeners = listeners.get("(max-width: 768px)");
    act(() => {
      if (queryListeners) {
        for (const handler of queryListeners)
          handler({ matches: true } as MediaQueryListEvent);
      }
    });

    expect(result.current).toBe(true);
  });
});

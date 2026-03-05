import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useImagePreloader } from "./useImagePreloader";

describe("useImagePreloader", () => {
  let originalImage: typeof window.Image;

  beforeEach(() => {
    originalImage = window.Image;
  });

  afterEach(() => {
    window.Image = originalImage;
    vi.restoreAllMocks();
  });

  it("should return loaded false and error false when src is null", () => {
    const { result } = renderHook(() => useImagePreloader(null));
    expect(result.current.loaded).toBe(false);
    expect(result.current.error).toBe(false);
  });

  it("should return loaded false and error false when src is undefined", () => {
    const { result } = renderHook(() => useImagePreloader(undefined));
    expect(result.current.loaded).toBe(false);
    expect(result.current.error).toBe(false);
  });

  it("should set loaded to true when image loads successfully", () => {
    let capturedOnload: (() => void) | null = null;

    window.Image = class MockImage {
      src = "";
      set onload(handler: (() => void) | null) {
        capturedOnload = handler;
      }
      get onload() {
        return capturedOnload;
      }
      set onerror(_handler: (() => void) | null) {
        /* noop */
      }
      get onerror() {
        return null;
      }
    } as unknown as typeof window.Image;

    const { result } = renderHook(() =>
      useImagePreloader("https://example.com/image.png")
    );

    act(() => {
      capturedOnload?.();
    });

    expect(result.current.loaded).toBe(true);
    expect(result.current.error).toBe(false);
  });

  it("should set error to true when image fails to load", () => {
    let capturedOnerror: (() => void) | null = null;

    window.Image = class MockImage {
      src = "";
      set onload(_handler: (() => void) | null) {
        /* noop */
      }
      get onload() {
        return null;
      }
      set onerror(handler: (() => void) | null) {
        capturedOnerror = handler;
      }
      get onerror() {
        return capturedOnerror;
      }
    } as unknown as typeof window.Image;

    const { result } = renderHook(() =>
      useImagePreloader("https://example.com/broken.png")
    );

    act(() => {
      capturedOnerror?.();
    });

    expect(result.current.loaded).toBe(false);
    expect(result.current.error).toBe(true);
  });
});

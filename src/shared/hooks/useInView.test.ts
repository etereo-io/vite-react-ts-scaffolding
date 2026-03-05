/** biome-ignore-all lint/complexity/useArrowFunction: vitest 4 requires function expressions for constructor mocks */
import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useInView } from "./useInView";

describe("useInView", () => {
  let observeMock: ReturnType<typeof vi.fn>;
  let disconnectMock: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    observeMock = vi.fn();
    disconnectMock = vi.fn();

    vi.stubGlobal(
      "IntersectionObserver",
      vi.fn(function (_callback: IntersectionObserverCallback) {
        return {
          observe: observeMock,
          disconnect: disconnectMock,
          unobserve: vi.fn()
        };
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should return inView as false initially", () => {
    const { result } = renderHook(() => useInView());
    expect(result.current.inView).toBe(false);
  });

  it("should return a ref callback", () => {
    const { result } = renderHook(() => useInView());
    expect(typeof result.current.ref).toBe("function");
  });

  it("should observe element when ref is attached", () => {
    const { result } = renderHook(() => useInView());
    const element = document.createElement("div");

    result.current.ref(element);
    expect(observeMock).toHaveBeenCalledWith(element);
  });

  it("should disconnect observer when ref receives null", () => {
    const { result } = renderHook(() => useInView());
    const element = document.createElement("div");

    result.current.ref(element);
    result.current.ref(null);

    expect(disconnectMock).toHaveBeenCalled();
  });

  it("should pass options to IntersectionObserver", () => {
    const { result } = renderHook(() =>
      useInView({ threshold: 0.5, rootMargin: "10px" })
    );
    const element = document.createElement("div");
    result.current.ref(element);

    expect(IntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
      threshold: 0.5,
      rootMargin: "10px"
    });
  });
});

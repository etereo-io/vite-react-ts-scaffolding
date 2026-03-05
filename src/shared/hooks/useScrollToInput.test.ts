import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useScrollToInput } from "./useScrollToInput";

describe("useScrollToInput", () => {
  it("should return a stable callback function", () => {
    const { result, rerender } = renderHook(() => useScrollToInput());
    const firstRef = result.current;
    rerender();
    expect(result.current).toBe(firstRef);
  });

  it("should scroll to and focus the first invalid element", () => {
    const scrollIntoViewMock = vi.fn();
    const focusMock = vi.fn();

    const form = document.createElement("form");
    const invalidInput = document.createElement("input");
    invalidInput.setAttribute("aria-invalid", "true");
    invalidInput.scrollIntoView = scrollIntoViewMock;
    invalidInput.focus = focusMock;
    form.appendChild(invalidInput);

    const ref = { current: form };
    const { result } = renderHook(() => useScrollToInput());

    result.current(ref);

    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "center"
    });
    expect(focusMock).toHaveBeenCalled();
  });

  it("should do nothing when form ref is null", () => {
    const ref = { current: null };
    const { result } = renderHook(() => useScrollToInput());
    expect(() => result.current(ref)).not.toThrow();
  });

  it("should do nothing when no invalid elements exist", () => {
    const form = document.createElement("form");
    const validInput = document.createElement("input");
    validInput.type = "text";
    form.appendChild(validInput);

    const ref = { current: form };
    const { result } = renderHook(() => useScrollToInput());
    expect(() => result.current(ref)).not.toThrow();
  });
});

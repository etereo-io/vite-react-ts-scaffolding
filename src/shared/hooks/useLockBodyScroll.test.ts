import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useLockBodyScroll } from "./useLockBodyScroll";

describe("useLockBodyScroll", () => {
  afterEach(() => {
    document.body.style.overflow = "";
  });

  it("should set body overflow to hidden when locked", () => {
    renderHook(() => useLockBodyScroll(true));
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("should not set body overflow when not locked", () => {
    document.body.style.overflow = "auto";
    renderHook(() => useLockBodyScroll(false));
    expect(document.body.style.overflow).toBe("auto");
  });

  it("should restore original overflow on unmount", () => {
    document.body.style.overflow = "auto";
    const { unmount } = renderHook(() => useLockBodyScroll(true));

    expect(document.body.style.overflow).toBe("hidden");

    unmount();
    expect(document.body.style.overflow).toBe("auto");
  });

  it("should default to locked when no argument is provided", () => {
    renderHook(() => useLockBodyScroll());
    expect(document.body.style.overflow).toBe("hidden");
  });
});

import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { useUrlModal } from "./useUrlModal";

function createWrapper(initialEntries: string[] = ["/"]) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    );
  };
}

describe("useUrlModal", () => {
  it("should return isOpen as false when param is not in URL", () => {
    const { result } = renderHook(() => useUrlModal("modal"), {
      wrapper: createWrapper()
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.value).toBeNull();
  });

  it("should return isOpen as true when param is in URL", () => {
    const { result } = renderHook(() => useUrlModal("modal"), {
      wrapper: createWrapper(["/?modal=true"])
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.value).toBe("true");
  });

  it("should open the modal by setting the param", () => {
    const { result } = renderHook(() => useUrlModal("dialog"), {
      wrapper: createWrapper()
    });

    act(() => {
      result.current.open();
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.value).toBe("true");
  });

  it("should open the modal with a custom value", () => {
    const { result } = renderHook(() => useUrlModal("dialog"), {
      wrapper: createWrapper()
    });

    act(() => {
      result.current.open("edit");
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.value).toBe("edit");
  });

  it("should close the modal by removing the param", () => {
    const { result } = renderHook(() => useUrlModal("modal"), {
      wrapper: createWrapper(["/?modal=true"])
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.close();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.value).toBeNull();
  });
});

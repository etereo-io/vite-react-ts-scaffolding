import { renderHook } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useNavigationBlocker } from "./useNavigationBlocker";

function HookHost({ when, message }: { when: boolean; message?: string }) {
  const result = useNavigationBlocker({ when, message });
  // Store result on window for test access
  (window as unknown as Record<string, unknown>).__blockerResult = result;
  return null;
}

function createDataRouterWrapper(when: boolean, message?: string) {
  const router = createMemoryRouter([
    {
      path: "/",
      element: <HookHost when={when} message={message} />
    }
  ]);
  return function Wrapper() {
    return <RouterProvider router={router} />;
  };
}

describe("useNavigationBlocker", () => {
  beforeEach(() => {
    vi.spyOn(window, "addEventListener");
    vi.spyOn(window, "removeEventListener");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete (window as unknown as Record<string, unknown>).__blockerResult;
  });

  it("should return initial state with showPrompt as false", async () => {
    const Wrapper = createDataRouterWrapper(false);
    const { unmount } = renderHook(() => null, { wrapper: Wrapper });

    const result = (window as unknown as Record<string, unknown>)
      .__blockerResult as {
      showPrompt: boolean;
      message: string;
      confirm: () => void;
      cancel: () => void;
    };

    expect(result.showPrompt).toBe(false);
    expect(result.message).toBe(
      "You have unsaved changes. Are you sure you want to leave?"
    );
    expect(typeof result.confirm).toBe("function");
    expect(typeof result.cancel).toBe("function");
    unmount();
  });

  it("should use custom message when provided", async () => {
    const customMessage = "Custom leave message";
    const Wrapper = createDataRouterWrapper(true, customMessage);
    const { unmount } = renderHook(() => null, { wrapper: Wrapper });

    const result = (window as unknown as Record<string, unknown>)
      .__blockerResult as {
      message: string;
    };

    expect(result.message).toBe(customMessage);
    unmount();
  });

  it("should add beforeunload listener when blocking is enabled", async () => {
    const Wrapper = createDataRouterWrapper(true);
    const { unmount } = renderHook(() => null, { wrapper: Wrapper });

    expect(window.addEventListener).toHaveBeenCalledWith(
      "beforeunload",
      expect.any(Function)
    );
    unmount();
  });

  it("should not add beforeunload listener when blocking is disabled", async () => {
    const Wrapper = createDataRouterWrapper(false);
    const { unmount } = renderHook(() => null, { wrapper: Wrapper });

    expect(window.addEventListener).not.toHaveBeenCalledWith(
      "beforeunload",
      expect.any(Function)
    );
    unmount();
  });
});

import { focusManager } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { useIdleTimer } from "react-idle-timer";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";

import { IDLE_TIMEOUT_MS } from "../idle.constants";
import { useIdleManager } from "./useIdleManager";

vi.mock("react-idle-timer", () => ({
  useIdleTimer: vi.fn()
}));

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    focusManager: {
      setFocused: vi.fn()
    }
  };
});

describe("useIdleManager", () => {
  let capturedProps: Record<string, unknown>;

  beforeEach(() => {
    vi.clearAllMocks();
    (useIdleTimer as Mock).mockImplementation((props) => {
      capturedProps = props;
      return {};
    });
  });

  it("should initialize useIdleTimer with the correct timeout", () => {
    renderHook(() => useIdleManager());

    expect(useIdleTimer).toHaveBeenCalledWith(
      expect.objectContaining({
        timeout: IDLE_TIMEOUT_MS
      })
    );
  });

  it("should pause polling when user becomes idle", () => {
    renderHook(() => useIdleManager());

    const onIdle = capturedProps.onIdle as () => void;
    onIdle();

    expect(focusManager.setFocused).toHaveBeenCalledWith(false);
  });

  it("should restore default focus behavior when user becomes active", () => {
    renderHook(() => useIdleManager());

    const onActive = capturedProps.onActive as () => void;
    onActive();

    expect(focusManager.setFocused).toHaveBeenCalledWith(undefined);
  });
});

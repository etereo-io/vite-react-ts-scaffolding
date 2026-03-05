/**
 * Bridges react-idle-timer with TanStack Query's focusManager to
 * pause refetch intervals when the user is idle.
 *
 * When idle:  focusManager.setFocused(false) → pauses polling
 * When active: focusManager.setFocused(undefined) → restores default behavior
 *
 * Queries with refetchIntervalInBackground: true are NOT affected.
 */

import { focusManager } from "@tanstack/react-query";
import { useIdleTimer } from "react-idle-timer";

import { IDLE_TIMEOUT_MS } from "../idle.constants";

export function useIdleManager() {
  useIdleTimer({
    timeout: IDLE_TIMEOUT_MS,
    onIdle: () => {
      focusManager.setFocused(false);
    },
    onActive: () => {
      focusManager.setFocused(undefined);
    }
  });
}

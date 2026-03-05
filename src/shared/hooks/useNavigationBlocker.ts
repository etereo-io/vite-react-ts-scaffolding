import { useCallback, useEffect, useState } from "react";
import { useBlocker } from "react-router";

interface UseNavigationBlockerOptions {
  readonly when: boolean;
  readonly message?: string;
}

export function useNavigationBlocker({
  when,
  message = "You have unsaved changes. Are you sure you want to leave?"
}: UseNavigationBlockerOptions) {
  const blocker = useBlocker(when);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (blocker.state === "blocked") setShowPrompt(true);
  }, [blocker.state]);

  const confirm = useCallback(() => {
    setShowPrompt(false);
    if (blocker.state === "blocked") blocker.proceed();
  }, [blocker]);

  const cancel = useCallback(() => {
    setShowPrompt(false);
    if (blocker.state === "blocked") blocker.reset();
  }, [blocker]);

  // Handle browser beforeunload
  useEffect(() => {
    if (!when) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [when]);

  return { showPrompt, message, confirm, cancel };
}

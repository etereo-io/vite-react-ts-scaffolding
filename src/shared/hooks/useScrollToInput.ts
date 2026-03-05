import { useCallback } from "react";

export function useScrollToInput() {
  return useCallback((formRef: React.RefObject<HTMLFormElement | null>) => {
    const form = formRef.current;
    if (!form) return;
    const firstInvalid = form.querySelector<HTMLElement>(
      "[aria-invalid='true'], .error, :invalid"
    );
    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      firstInvalid.focus();
    }
  }, []);
}

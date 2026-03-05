import { useEffect } from "react";
import { gtag } from "@/lib/analytics/ga";

/**
 * Global click listener that picks up `data-track` attributes for GA4 event tracking.
 *
 * On click:
 *   1. Finds the nearest ancestor with `[data-track]`
 *   2. Reads `data-track` as the event name
 *   3. Collects all `data-track-*` attributes as event params (kebab → camelCase keys)
 *   4. Fires `gtag('event', name, params)`
 *
 * Mount inside `AnalyticsLoader` so it only runs when analytics is enabled.
 */
export function TrackingListener() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!(e.target instanceof Element)) return;

      const tracked = e.target.closest("[data-track]");
      if (!tracked) return;

      const eventName = (tracked as HTMLElement).dataset.track;
      if (!eventName) return;

      // Collect data-track-* params (exclude data-track itself)
      const params: Record<string, string> = {};
      const dataset = (tracked as HTMLElement).dataset;
      for (const key in dataset) {
        if (key === "track") continue;
        if (key.startsWith("track")) {
          // dataset keys are already camelCase from DOM:
          // data-track-view → dataset.trackView
          // data-track-session-id → dataset.trackSessionId
          // Strip the "track" prefix and lowercase the first char
          const paramKey = key.slice(5); // remove "track"
          const normalizedKey =
            paramKey.charAt(0).toLowerCase() + paramKey.slice(1);
          params[normalizedKey] = dataset[key] as string;
        }
      }

      if (Object.keys(params).length > 0) {
        gtag("event", eventName, params);
      } else {
        gtag("event", eventName);
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}

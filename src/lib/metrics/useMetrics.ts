import { isAnalyticsEnabled } from "@/app/features/config/config.helpers";
import { gtag } from "@/lib/analytics/ga";

export function useMetrics() {
  return {
    event: (name: string, params?: Record<string, string | number>) => {
      if (!isAnalyticsEnabled()) return;
      gtag("event", name, params);
    }
  };
}

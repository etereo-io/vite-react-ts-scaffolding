import type React from "react";
import { useEffect, useState } from "react";
import { isAnalyticsEnabled } from "@/app/features/config/config.helpers";
import { getConfig } from "@/app/features/config/config.service";
import { initializeGA } from "./ga";
import { TrackingListener } from "./TrackingListener";

/**
 * Loader component that initializes Google Analytics when the app config
 * indicates analytics is enabled.
 *
 * Must be rendered inside {@link ConfigLoader} so that the config is
 * guaranteed to be available.
 */
export function AnalyticsLoader({
  children
}: {
  readonly children: React.ReactNode;
}) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized) {
      return;
    }

    if (!isAnalyticsEnabled()) {
      return;
    }

    const measurementId = getConfig<string>("analytics.measurementId", {
      required: false
    });

    if (!measurementId) {
      return;
    }

    initializeGA(measurementId);
    setIsInitialized(true);
  }, [isInitialized]);

  return (
    <>
      {isInitialized && <TrackingListener />}
      {children}
    </>
  );
}

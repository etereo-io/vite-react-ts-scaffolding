/**
 * Google Analytics 4 (GA4) integration module.
 *
 * Dynamically injects the gtag.js script and provides a typed gtag function.
 * Only loads when analytics is enabled via config.
 */

// ---------------------------------------------------------------------------
// Global type declarations
// ---------------------------------------------------------------------------

declare global {
  interface Window {
    // biome-ignore lint/suspicious/noExplicitAny: GA4 dataLayer accepts mixed argument types
    dataLayer?: any[];
    gtag?: Gtag;
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type GtagEventParams = {
  readonly page_path?: string;
  readonly page_title?: string;
  readonly page_location?: string;
  readonly send_to?: string;
  readonly event_category?: string;
  readonly event_label?: string;
  readonly value?: number;
  readonly [key: string]: unknown;
};

export type Gtag = {
  (command: "js", date: Date): void;
  (command: "config", targetId: string, params?: GtagEventParams): void;
  (command: "event", eventName: string, params?: GtagEventParams): void;
  (command: "set", params: Record<string, unknown>): void;
};

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

let initialized = false;

// ---------------------------------------------------------------------------
// Initialization
// ---------------------------------------------------------------------------

/**
 * Initialize Google Analytics by injecting the gtag.js script tag and
 * configuring the measurement ID.
 *
 * Safe to call multiple times — subsequent calls are no-ops.
 */
export function initializeGA(measurementId: string): void {
  if (initialized) {
    return;
  }

  // 1. Bootstrap dataLayer
  window.dataLayer = window.dataLayer || [];

  // 2. Define the global gtag function (mirrors the official GA4 snippet)
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };

  // 3. Record the initialization timestamp
  window.gtag("js", new Date());

  // 4. Configure the measurement ID (sends the initial page_view automatically)
  window.gtag("config", measurementId);

  // 5. Inject the gtag.js script (async to avoid blocking)
  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  script.async = true;
  document.head.appendChild(script);

  initialized = true;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Typed wrapper around `window.gtag`.
 *
 * No-ops gracefully when GA has not been initialized.
 */
export const gtag: Gtag = ((...args: unknown[]) => {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push(args);
  }
}) as Gtag;

/**
 * Convenience helper — sends a `page_view` event for SPA route changes.
 */
export function trackPageView(pagePath: string, pageTitle?: string): void {
  gtag("event", "page_view", {
    page_path: pagePath,
    page_title: pageTitle ?? document.title
  });
}

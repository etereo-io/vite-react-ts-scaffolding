import "@testing-library/jest-dom/vitest";
import "@testing-library/user-event";

import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// happy-dom 20+ provides matchMedia / ResizeObserver / IntersectionObserver /
// DOMMatrix / scrollTo / scrollIntoView natively. The legacy polyfills
// (intersection-observer, matchmedia-polyfill, @juggle/resize-observer) are
// no-ops here — removed to skip the module evaluation cost on every test file.
//
// Object.defineProperty(matchMedia) is kept because the polyfill returned
// `matches: false` deterministically for every query; happy-dom's built-in
// can return different values depending on viewport defaults and some
// component tests rely on the deterministic fallback.

Object.defineProperty(window, "matchMedia", {
  writable: true,
  // biome-ignore lint/suspicious/noExplicitAny: configuration
  value: (query: any) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => null,
    removeListener: () => null,
    addEventListener: () => null,
    removeEventListener: () => null,
    dispatchEvent: () => null
  })
});

// vi.fn so tests can assert call patterns (e.g. spy on scrollIntoView).
Element.prototype.scrollIntoView = vi.fn();
Element.prototype.scrollTo = vi.fn();
document.queryCommandSupported = () => false;

// Mock the browser msw – provide an explicit pass-through so that
// the provider tree renders children normally during tests.
vi.mock("@/app/features/mock-server/providers/MockProvider", () => ({
  MockProvider: ({ children }: { readonly children: unknown }) => children
}));

// Per-test DOM cleanup. MSW lifecycle is registered opt-in via
// `setupMockServer()` from "#/msw" only in tests that need it.
//
// `useRealTimers()` here is a defensive net: tests calling `vi.setSystemTime()`
// in beforeEach without restoring would leak the frozen clock into the next
// file scheduled on the same worker thread.
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

import "@testing-library/jest-dom/vitest";
import "@testing-library/user-event";

import "@/app/polyfills";
import "intersection-observer";
import "matchmedia-polyfill";
import "matchmedia-polyfill/matchMedia.addListener";

import { ResizeObserver as ResizeObserverPolyfill } from "@juggle/resize-observer";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, beforeEach, vi } from "vitest";

import "@/app/modules/modules";

import { mockServerConfig } from "@/mock-server/constants";
import { server } from "@/mock-server/node";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: (query: any) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => null,
    removeListener: () => null,
    addEventListener: () => null,
    removeEventListener: () => null,
    dispatchEvent: () => null,
  }),
});

if (typeof window !== "undefined") {
  if (!window.ResizeObserver) {
    window.ResizeObserver = ResizeObserverPolyfill;
  }
}

if (typeof Element !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Element.prototype.scrollIntoView = vi.fn<any, typeof Element.prototype.scrollIntoView>();
}

if (typeof document !== "undefined") {
  document.queryCommandSupported = () => false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Element.prototype.scrollTo = vi.fn<any, typeof Element.prototype.scrollTo>();
}

// https://github.com/vitest-dev/vitest/issues/1450
vi.resetModules();

beforeAll(() => {
  server.listen(mockServerConfig);
});

beforeEach(() => {});

afterAll(() => {
  server.close();
});

afterEach(() => {
  server.resetHandlers();
  cleanup();
});

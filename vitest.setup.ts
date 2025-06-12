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
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
  Element.prototype.scrollIntoView = vi.fn<
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    any,
    typeof Element.prototype.scrollIntoView
  >();
}

if (typeof document !== "undefined") {
  document.queryCommandSupported = () => false;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  Element.prototype.scrollTo = vi.fn<any, typeof Element.prototype.scrollTo>();
}

// https://github.com/vitest-dev/vitest/issues/1450
vi.resetModules();

beforeAll(() => {
  server.listen(mockServerConfig);
});

// biome-ignore lint/suspicious/noEmptyBlockStatements: <explanation>
beforeEach(() => {});

afterAll(() => {
  server.close();
});

afterEach(() => {
  server.resetHandlers();
  cleanup();
});

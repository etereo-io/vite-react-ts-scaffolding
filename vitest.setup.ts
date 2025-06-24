import "@testing-library/jest-dom/vitest";
import "@testing-library/user-event";

import "@/app/polyfills";
import "intersection-observer";
import "matchmedia-polyfill";
import "matchmedia-polyfill/matchMedia.addListener";

import { ResizeObserver as ResizeObserverPolyfill } from "@juggle/resize-observer";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, beforeEach, vi } from "vitest";

import "@/app/features/modules";

import { mockServerConfig } from "@/app/features/mock-server/constants";
import { server } from "@/app/features/mock-server/node";

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

if (typeof window !== "undefined") {
  if (!window.ResizeObserver) {
    window.ResizeObserver = ResizeObserverPolyfill;
  }
}

if (typeof Element !== "undefined") {
  Element.prototype.scrollIntoView = vi.fn();
}

if (typeof document !== "undefined") {
  document.queryCommandSupported = () => false;
  Element.prototype.scrollTo = vi.fn();
}

// https://github.com/vitest-dev/vitest/issues/1450
vi.resetModules();

// Mock the browser msw
vi.mock("./src/app/features/mock-server/providers/MockProvider");

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

/** biome-ignore-all lint/style/noNonNullAssertion: test */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("ga module", () => {
  // Re-import the module fresh for each test group because
  // `initializeGA` uses a module-level `initialized` flag.
  beforeEach(() => {
    vi.resetModules();
    for (const s of document.head.querySelectorAll("script")) s.remove();
    // biome-ignore lint/suspicious/noExplicitAny: test cleanup
    delete (window as any).dataLayer;
    // biome-ignore lint/suspicious/noExplicitAny: test cleanup
    delete (window as any).gtag;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("initializeGA", () => {
    it("should create a script tag with correct src", async () => {
      const { initializeGA } = await import("./ga");

      initializeGA("G-TEST123");

      const scripts = document.head.querySelectorAll("script");
      const gtagScript = Array.from(scripts).find((s) =>
        s.src.includes("googletagmanager.com/gtag/js")
      );

      expect(gtagScript).toBeDefined();
      expect(gtagScript!.src).toBe(
        "https://www.googletagmanager.com/gtag/js?id=G-TEST123"
      );
      expect(gtagScript!.async).toBe(true);
    });

    it("should be idempotent — calling twice only creates one script", async () => {
      const { initializeGA } = await import("./ga");

      initializeGA("G-TEST123");
      initializeGA("G-TEST123");

      const scripts = document.head.querySelectorAll("script");
      const gtagScripts = Array.from(scripts).filter((s) =>
        s.src.includes("googletagmanager.com/gtag/js")
      );

      expect(gtagScripts).toHaveLength(1);
    });

    it("should bootstrap window.dataLayer", async () => {
      const { initializeGA } = await import("./ga");

      initializeGA("G-DATALAYER");

      expect(window.dataLayer).toBeDefined();
      expect(Array.isArray(window.dataLayer)).toBe(true);
    });
  });

  describe("gtag", () => {
    it("should push to window.dataLayer", async () => {
      const { gtag } = await import("./ga");

      window.dataLayer = [];

      gtag("event", "test_event", { page_path: "/home" });

      expect(window.dataLayer).toHaveLength(1);
      expect(window.dataLayer[0]).toEqual([
        "event",
        "test_event",
        { page_path: "/home" }
      ]);
    });

    it("should no-op when dataLayer is not present", async () => {
      const { gtag } = await import("./ga");

      // biome-ignore lint/suspicious/noExplicitAny: test cleanup
      delete (window as any).dataLayer;

      expect(() => gtag("event", "orphan_event")).not.toThrow();
    });
  });

  describe("trackPageView", () => {
    it("should send page_view event with page_path and page_title", async () => {
      const { trackPageView } = await import("./ga");

      window.dataLayer = [];

      trackPageView("/about", "About Page");

      expect(window.dataLayer).toHaveLength(1);
      expect(window.dataLayer[0]).toEqual([
        "event",
        "page_view",
        { page_path: "/about", page_title: "About Page" }
      ]);
    });

    it("should fall back to document.title when pageTitle is omitted", async () => {
      const { trackPageView } = await import("./ga");

      window.dataLayer = [];

      const originalTitle = document.title;
      document.title = "Test Document Title";

      trackPageView("/contact");

      expect(window.dataLayer[0]).toEqual([
        "event",
        "page_view",
        { page_path: "/contact", page_title: "Test Document Title" }
      ]);

      document.title = originalTitle;
    });
  });
});

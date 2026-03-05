import type { Breakpoint } from "./breakpoints";
import { BREAKPOINTS, getBreakpoint } from "./breakpoints";

describe("BREAKPOINTS", () => {
  test("contains expected breakpoint values", () => {
    expect(BREAKPOINTS.sm).toBe(640);
    expect(BREAKPOINTS.md).toBe(768);
    expect(BREAKPOINTS.lg).toBe(1024);
    expect(BREAKPOINTS.xl).toBe(1280);
    expect(BREAKPOINTS["2xl"]).toBe(1536);
  });
});

describe("getBreakpoint", () => {
  test("returns null for width below smallest breakpoint", () => {
    expect(getBreakpoint(320)).toBeNull();
  });

  test("returns null for width of 0", () => {
    expect(getBreakpoint(0)).toBeNull();
  });

  test('returns "sm" for width at sm threshold', () => {
    expect(getBreakpoint(640)).toBe("sm");
  });

  test('returns "sm" for width between sm and md', () => {
    expect(getBreakpoint(700)).toBe("sm");
  });

  test('returns "md" for width at md threshold', () => {
    expect(getBreakpoint(768)).toBe("md");
  });

  test('returns "md" for width between md and lg', () => {
    expect(getBreakpoint(900)).toBe("md");
  });

  test('returns "lg" for width at lg threshold', () => {
    expect(getBreakpoint(1024)).toBe("lg");
  });

  test('returns "xl" for width at xl threshold', () => {
    expect(getBreakpoint(1280)).toBe("xl");
  });

  test('returns "2xl" for width at 2xl threshold', () => {
    expect(getBreakpoint(1536)).toBe("2xl");
  });

  test('returns "2xl" for very large width', () => {
    expect(getBreakpoint(2560)).toBe("2xl");
  });

  test("returns null for negative width", () => {
    expect(getBreakpoint(-100)).toBeNull();
  });

  test("Breakpoint type includes all expected keys", () => {
    const keys: Breakpoint[] = ["sm", "md", "lg", "xl", "2xl"];
    for (const key of keys) {
      expect(BREAKPOINTS[key]).toBeDefined();
    }
  });
});

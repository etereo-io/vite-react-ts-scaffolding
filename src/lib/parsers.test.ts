import {
  safeParseBoolean,
  safeParseFloat,
  safeParseInt,
  safeParseJSON
} from "./parsers";

describe("safeParseInt", () => {
  test("parses a valid integer string", () => {
    expect(safeParseInt("42")).toBe(42);
  });

  test("parses a negative integer string", () => {
    expect(safeParseInt("-7")).toBe(-7);
  });

  test("returns fallback for non-numeric string", () => {
    expect(safeParseInt("abc")).toBe(0);
  });

  test("returns custom fallback for non-numeric string", () => {
    expect(safeParseInt("abc", -1)).toBe(-1);
  });

  test("parses string with leading number", () => {
    expect(safeParseInt("42px")).toBe(42);
  });

  test("returns fallback for empty string", () => {
    expect(safeParseInt("")).toBe(0);
  });

  test("truncates decimal values", () => {
    expect(safeParseInt("3.14")).toBe(3);
  });
});

describe("safeParseFloat", () => {
  test("parses a valid float string", () => {
    expect(safeParseFloat("3.14")).toBe(3.14);
  });

  test("parses a negative float string", () => {
    expect(safeParseFloat("-2.5")).toBe(-2.5);
  });

  test("parses an integer string as float", () => {
    expect(safeParseFloat("42")).toBe(42);
  });

  test("returns fallback for non-numeric string", () => {
    expect(safeParseFloat("abc")).toBe(0);
  });

  test("returns custom fallback for non-numeric string", () => {
    expect(safeParseFloat("abc", -1)).toBe(-1);
  });

  test("returns fallback for empty string", () => {
    expect(safeParseFloat("")).toBe(0);
  });

  test("parses string with leading number", () => {
    expect(safeParseFloat("3.14px")).toBe(3.14);
  });
});

describe("safeParseJSON", () => {
  test("parses valid JSON object", () => {
    expect(safeParseJSON('{"name":"John"}', {})).toEqual({ name: "John" });
  });

  test("parses valid JSON array", () => {
    expect(safeParseJSON("[1,2,3]", [])).toEqual([1, 2, 3]);
  });

  test("parses valid JSON string", () => {
    expect(safeParseJSON('"hello"', "")).toBe("hello");
  });

  test("parses valid JSON number", () => {
    expect(safeParseJSON("42", 0)).toBe(42);
  });

  test("returns fallback for invalid JSON", () => {
    expect(safeParseJSON("not json", "default")).toBe("default");
  });

  test("returns fallback for empty string", () => {
    expect(safeParseJSON("", null)).toBeNull();
  });

  test("returns fallback for malformed JSON", () => {
    expect(safeParseJSON("{broken", {})).toEqual({});
  });
});

describe("safeParseBoolean", () => {
  test('returns true for "true"', () => {
    expect(safeParseBoolean("true")).toBe(true);
  });

  test('returns true for "1"', () => {
    expect(safeParseBoolean("1")).toBe(true);
  });

  test('returns true for "yes"', () => {
    expect(safeParseBoolean("yes")).toBe(true);
  });

  test("returns true for case-insensitive TRUE", () => {
    expect(safeParseBoolean("TRUE")).toBe(true);
  });

  test("returns true for case-insensitive Yes", () => {
    expect(safeParseBoolean("Yes")).toBe(true);
  });

  test('returns false for "false"', () => {
    expect(safeParseBoolean("false")).toBe(false);
  });

  test('returns false for "0"', () => {
    expect(safeParseBoolean("0")).toBe(false);
  });

  test('returns false for "no"', () => {
    expect(safeParseBoolean("no")).toBe(false);
  });

  test("returns false for empty string", () => {
    expect(safeParseBoolean("")).toBe(false);
  });

  test("returns false for arbitrary string", () => {
    expect(safeParseBoolean("maybe")).toBe(false);
  });

  test("handles whitespace around value", () => {
    expect(safeParseBoolean("  true  ")).toBe(true);
  });
});

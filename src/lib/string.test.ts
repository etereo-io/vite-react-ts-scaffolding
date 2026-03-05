import { capitalize, getFullName, getInitials, truncate } from "./string";

describe("getInitials", () => {
  test("returns initials for a two-word name", () => {
    expect(getInitials("John Doe")).toBe("JD");
  });

  test("returns single initial for a one-word name", () => {
    expect(getInitials("John")).toBe("J");
  });

  test("returns at most two initials for a long name", () => {
    expect(getInitials("John Michael Doe")).toBe("JM");
  });

  test("handles extra whitespace between words", () => {
    expect(getInitials("John   Doe")).toBe("JD");
  });

  test("handles empty string", () => {
    expect(getInitials("")).toBe("");
  });

  test("uppercases lowercase initials", () => {
    expect(getInitials("john doe")).toBe("JD");
  });

  test("handles leading and trailing whitespace", () => {
    expect(getInitials("  Alice Bob  ")).toBe("AB");
  });
});

describe("getFullName", () => {
  test("combines first and last name", () => {
    expect(getFullName("John", "Doe")).toBe("John Doe");
  });

  test("returns first name only when no last name provided", () => {
    expect(getFullName("John")).toBe("John");
  });

  test("returns first name only when last name is undefined", () => {
    expect(getFullName("John", undefined)).toBe("John");
  });

  test("trims whitespace from first name when no last name", () => {
    expect(getFullName("  John  ")).toBe("John");
  });

  test("trims whitespace from combined name", () => {
    expect(getFullName("  John  ", "  Doe  ")).toBe("John     Doe");
  });

  test("handles empty first name with last name", () => {
    expect(getFullName("", "Doe")).toBe("Doe");
  });

  test("handles empty first name without last name", () => {
    expect(getFullName("")).toBe("");
  });
});

describe("capitalize", () => {
  test("capitalizes the first letter and lowercases the rest", () => {
    expect(capitalize("hello")).toBe("Hello");
  });

  test("handles already capitalized string", () => {
    expect(capitalize("Hello")).toBe("Hello");
  });

  test("lowercases remaining characters", () => {
    expect(capitalize("hELLO")).toBe("Hello");
  });

  test("handles single character", () => {
    expect(capitalize("a")).toBe("A");
  });

  test("returns empty string for empty input", () => {
    expect(capitalize("")).toBe("");
  });

  test("handles all uppercase string", () => {
    expect(capitalize("WORLD")).toBe("World");
  });
});

describe("truncate", () => {
  test("returns original string when shorter than maxLength", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  test("returns original string when equal to maxLength", () => {
    expect(truncate("hello", 5)).toBe("hello");
  });

  test("truncates and appends default suffix", () => {
    expect(truncate("hello world", 8)).toBe("hello...");
  });

  test("truncates with custom suffix", () => {
    expect(truncate("hello world", 7, "…")).toBe("hello …");
  });

  test("handles maxLength smaller than suffix length", () => {
    expect(truncate("hello world", 3)).toBe("...");
  });

  test("handles empty string", () => {
    expect(truncate("", 5)).toBe("");
  });

  test("handles suffix that equals maxLength", () => {
    expect(truncate("hello world", 3, "---")).toBe("---");
  });
});

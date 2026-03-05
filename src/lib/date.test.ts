import {
  formatDateTimeValue,
  formatDateValue,
  formatDistanceFromNow,
  formatTimeValue,
  getDayOfWeek,
  getMonthName,
  parseDate
} from "./date";

describe("parseDate", () => {
  test("returns null for null input", () => {
    expect(parseDate(null)).toBeNull();
  });

  test("returns null for undefined input", () => {
    expect(parseDate(undefined)).toBeNull();
  });

  test("parses a valid Date object", () => {
    const date = new Date("2024-04-29T00:00:00Z");
    expect(parseDate(date)).toEqual(date);
  });

  test("returns null for an invalid Date object", () => {
    expect(parseDate(new Date("invalid"))).toBeNull();
  });

  test("parses a numeric timestamp", () => {
    const timestamp = new Date("2024-04-29T00:00:00Z").getTime();
    const result = parseDate(timestamp);
    expect(result).toBeInstanceOf(Date);
    expect(result?.getTime()).toBe(timestamp);
  });

  test("parses an ISO string", () => {
    const result = parseDate("2024-04-29T12:00:00Z");
    expect(result).toBeInstanceOf(Date);
    expect(result?.toISOString()).toBe("2024-04-29T12:00:00.000Z");
  });

  test("parses a date-only string", () => {
    const result = parseDate("2024-04-29");
    expect(result).toBeInstanceOf(Date);
  });

  test("returns null for an invalid string", () => {
    expect(parseDate("not-a-date")).toBeNull();
  });
});

describe("formatDateValue", () => {
  test("formats a Date with default format (PP)", () => {
    const date = new Date("2024-04-29T00:00:00Z");
    const result = formatDateValue(date);
    expect(result).toContain("Apr");
    expect(result).toContain("2024");
  });

  test("formats a string date with default format", () => {
    const result = formatDateValue("2024-04-29T00:00:00Z");
    expect(result).toContain("Apr");
    expect(result).toContain("2024");
  });

  test("formats with a custom format", () => {
    const date = new Date("2024-04-29T00:00:00Z");
    const result = formatDateValue(date, "yyyy-MM-dd");
    expect(result).toBe("2024-04-29");
  });

  test("returns empty string for invalid date string", () => {
    expect(formatDateValue("invalid")).toBe("");
  });
});

describe("formatTimeValue", () => {
  test("formats a Date with default time format (p)", () => {
    const date = new Date("2024-04-29T14:30:00Z");
    const result = formatTimeValue(date);
    expect(result).toMatch(/\d{1,2}:\d{2}/);
  });

  test("formats a string date with default time format", () => {
    const result = formatTimeValue("2024-04-29T14:30:00Z");
    expect(result).toMatch(/\d{1,2}:\d{2}/);
  });

  test("returns empty string for invalid date string", () => {
    expect(formatTimeValue("invalid")).toBe("");
  });
});

describe("formatDateTimeValue", () => {
  test("formats a Date with date and time", () => {
    const date = new Date("2024-04-29T14:30:00Z");
    const result = formatDateTimeValue(date);
    expect(result).toContain("Apr");
    expect(result).toContain("2024");
    expect(result).toMatch(/\d{1,2}:\d{2}/);
  });

  test("formats a string date with date and time", () => {
    const result = formatDateTimeValue("2024-04-29T14:30:00Z");
    expect(result).toContain("Apr");
    expect(result).toContain("2024");
  });

  test("returns empty string for invalid date string", () => {
    expect(formatDateTimeValue("invalid")).toBe("");
  });
});

describe("formatDistanceFromNow", () => {
  test("returns a human-readable distance string", () => {
    const recentDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const result = formatDistanceFromNow(recentDate);
    expect(result).toContain("ago");
  });

  test("handles string input", () => {
    const recentDate = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const result = formatDistanceFromNow(recentDate);
    expect(result).toContain("ago");
  });

  test("returns empty string for invalid date string", () => {
    expect(formatDistanceFromNow("invalid")).toBe("");
  });
});

describe("getMonthName", () => {
  test("returns January for index 0", () => {
    expect(getMonthName(0)).toBe("January");
  });

  test("returns June for index 5", () => {
    expect(getMonthName(5)).toBe("June");
  });

  test("returns December for index 11", () => {
    expect(getMonthName(11)).toBe("December");
  });
});

describe("getDayOfWeek", () => {
  test("returns the day of the week for a Monday", () => {
    const monday = new Date("2024-04-29T00:00:00Z");
    expect(getDayOfWeek(monday)).toBe("Monday");
  });

  test("returns the day of the week for a Sunday", () => {
    const sunday = new Date("2024-04-28T00:00:00Z");
    expect(getDayOfWeek(sunday)).toBe("Sunday");
  });

  test("returns the day of the week for a Wednesday", () => {
    const wednesday = new Date("2024-05-01T00:00:00Z");
    expect(getDayOfWeek(wednesday)).toBe("Wednesday");
  });
});

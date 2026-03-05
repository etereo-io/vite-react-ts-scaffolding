import { formatCurrency, formatNumber, formatPercentage } from "./format";

describe("formatCurrency", () => {
  test("formats USD by default", () => {
    expect(formatCurrency(1234.56)).toBe("$1,234.56");
  });

  test("formats EUR currency", () => {
    const result = formatCurrency(1234.56, "EUR", "de-DE");
    expect(result).toContain("1.234,56");
  });

  test("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  test("formats negative amounts", () => {
    expect(formatCurrency(-99.99)).toBe("-$99.99");
  });

  test("formats large amounts with grouping", () => {
    expect(formatCurrency(1000000)).toBe("$1,000,000.00");
  });
});

describe("formatNumber", () => {
  test("formats number with default options", () => {
    expect(formatNumber(1234567)).toBe("1,234,567");
  });

  test("formats number with custom fraction digits", () => {
    expect(
      formatNumber(1234.5, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    ).toBe("1,234.50");
  });

  test("formats zero", () => {
    expect(formatNumber(0)).toBe("0");
  });

  test("formats negative numbers", () => {
    expect(formatNumber(-1234)).toBe("-1,234");
  });

  test("formats with custom locale", () => {
    const result = formatNumber(1234.56, { maximumFractionDigits: 2 }, "de-DE");
    expect(result).toContain("1.234,56");
  });
});

describe("formatPercentage", () => {
  test("formats a decimal as percentage", () => {
    expect(formatPercentage(0.75)).toBe("75%");
  });

  test("formats with decimal places", () => {
    expect(formatPercentage(0.7534, 2)).toBe("75.34%");
  });

  test("formats zero", () => {
    expect(formatPercentage(0)).toBe("0%");
  });

  test("formats 100%", () => {
    expect(formatPercentage(1)).toBe("100%");
  });

  test("formats values over 100%", () => {
    expect(formatPercentage(1.5)).toBe("150%");
  });

  test("formats with no decimals by default", () => {
    expect(formatPercentage(0.333)).toBe("33%");
  });

  test("formats negative percentages", () => {
    expect(formatPercentage(-0.25)).toBe("-25%");
  });
});

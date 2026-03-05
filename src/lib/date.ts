import { format, formatDistanceToNow, isValid, parseISO } from "date-fns";

export function parseDate(
  input: Date | string | number | null | undefined
): Date | null {
  if (input === null || input === undefined) return null;

  if (input instanceof Date) {
    return isValid(input) ? input : null;
  }

  if (typeof input === "number") {
    const date = new Date(input);
    return isValid(date) ? date : null;
  }

  if (typeof input === "string") {
    const parsed = parseISO(input);
    if (isValid(parsed)) return parsed;

    const fallback = new Date(input);
    return isValid(fallback) ? fallback : null;
  }

  return null;
}

export function formatDateValue(
  date: Date | string,
  dateFormat = "PP"
): string {
  const parsed = typeof date === "string" ? parseDate(date) : date;
  if (!parsed || !isValid(parsed)) return "";
  return format(parsed, dateFormat);
}

export function formatTimeValue(date: Date | string, timeFormat = "p"): string {
  const parsed = typeof date === "string" ? parseDate(date) : date;
  if (!parsed || !isValid(parsed)) return "";
  return format(parsed, timeFormat);
}

export function formatDateTimeValue(date: Date | string): string {
  const parsed = typeof date === "string" ? parseDate(date) : date;
  if (!parsed || !isValid(parsed)) return "";
  return format(parsed, "PP p");
}

export function formatDistanceFromNow(date: Date | string): string {
  const parsed = typeof date === "string" ? parseDate(date) : date;
  if (!parsed || !isValid(parsed)) return "";
  return formatDistanceToNow(parsed, { addSuffix: true });
}

export function getMonthName(monthIndex: number): string {
  const date = new Date(2024, monthIndex, 1);
  return format(date, "LLLL");
}

export function getDayOfWeek(date: Date): string {
  return format(date, "EEEE");
}

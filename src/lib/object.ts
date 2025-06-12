export const removeEmptyOrNull = (obj: Record<string, unknown>) => {
  for (const clave in obj) {
    const value = obj[clave];

    if (typeof value === "object" && !(value instanceof Array)) {
      removeEmptyOrNull(value as Record<string, unknown>);
    }

    if (
      value === null ||
      value === undefined ||
      value === "" ||
      value === 0 ||
      (Array.isArray(value) && value.length === 0)
    ) {
      delete obj[clave];
    }
  }

  return obj;
};

export function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

export function isObjectEmpty(
  obj: Record<string, unknown> | null | undefined
): boolean {
  if (!obj) return true;

  return Object.keys(obj).length === 0;
}

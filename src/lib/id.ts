export function generateUUID(): string {
  return crypto.randomUUID();
}

export function generateId(prefix?: string): string {
  const id = Math.random().toString(36).substring(2, 10);
  return prefix ? `${prefix}_${id}` : id;
}

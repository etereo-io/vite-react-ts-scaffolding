export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

export function getBreakpoint(width: number): Breakpoint | null {
  const entries = Object.entries(BREAKPOINTS) as [Breakpoint, number][];
  const sorted = entries.sort(([, a], [, b]) => b - a);

  for (const [name, minWidth] of sorted) {
    if (width >= minWidth) {
      return name;
    }
  }

  return null;
}

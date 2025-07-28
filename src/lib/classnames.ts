import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(
  ...classNames: (string | Record<string, boolean | undefined> | undefined)[]
): string {
  return twMerge(clsx(classNames));
}

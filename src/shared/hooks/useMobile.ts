import { useMediaQuery } from "./useMediaQuery";

export function useMobile(): boolean {
  return useMediaQuery("(max-width: 767px)");
}

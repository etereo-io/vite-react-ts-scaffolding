import { useCallback, useEffect, useState } from "react";

interface ScrollPosition {
  readonly scrollTop: number;
  readonly scrollLeft: number;
  readonly scrollHeight: number;
  readonly scrollWidth: number;
  readonly clientHeight: number;
  readonly clientWidth: number;
}

export function useElementScroll(
  elementRef: React.RefObject<HTMLElement | null>
) {
  const [scroll, setScroll] = useState<ScrollPosition>({
    scrollTop: 0,
    scrollLeft: 0,
    scrollHeight: 0,
    scrollWidth: 0,
    clientHeight: 0,
    clientWidth: 0
  });

  const handleScroll = useCallback(() => {
    const el = elementRef.current;
    if (!el) return;
    setScroll({
      scrollTop: el.scrollTop,
      scrollLeft: el.scrollLeft,
      scrollHeight: el.scrollHeight,
      scrollWidth: el.scrollWidth,
      clientHeight: el.clientHeight,
      clientWidth: el.clientWidth
    });
  }, [elementRef]);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => el.removeEventListener("scroll", handleScroll);
  }, [elementRef, handleScroll]);

  return scroll;
}

import { useEffect, useState } from "react";

export function useRtl(): boolean {
  const [isRtl, setIsRtl] = useState(
    () => document.documentElement.dir === "rtl"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsRtl(document.documentElement.dir === "rtl");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["dir"]
    });
    return () => observer.disconnect();
  }, []);

  return isRtl;
}

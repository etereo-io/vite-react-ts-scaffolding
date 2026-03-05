import { useEffect, useState } from "react";

export function useImagePreloader(src: string | null | undefined): {
  loaded: boolean;
  error: boolean;
} {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) {
      setLoaded(false);
      setError(false);
      return;
    }

    const img = new Image();
    img.onload = () => {
      setLoaded(true);
      setError(false);
    };
    img.onerror = () => {
      setLoaded(false);
      setError(true);
    };
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return { loaded, error };
}

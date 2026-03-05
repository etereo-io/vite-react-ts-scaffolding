import { useCallback } from "react";
import { useInView } from "./useInView";

interface UseInfiniteScrollOptions {
  readonly onLoadMore: () => void;
  readonly hasMore: boolean;
  readonly isLoading: boolean;
  readonly rootMargin?: string;
}

export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
  rootMargin = "200px"
}: UseInfiniteScrollOptions) {
  const handleInView = useCallback(() => {
    if (hasMore && !isLoading) onLoadMore();
  }, [hasMore, isLoading, onLoadMore]);

  const { ref, inView } = useInView({ rootMargin });

  // Trigger load when sentinel comes into view
  if (inView && hasMore && !isLoading) handleInView();

  return { sentinelRef: ref };
}

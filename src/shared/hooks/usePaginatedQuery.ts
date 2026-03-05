import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface PaginationState {
  readonly offset: number;
  readonly limit: number;
}

interface UsePaginatedQueryOptions<T>
  extends Omit<UseQueryOptions<T>, "queryKey" | "queryFn"> {
  readonly queryKey: readonly unknown[];
  readonly queryFn: (pagination: PaginationState) => Promise<T>;
  readonly initialLimit?: number;
}

export function usePaginatedQuery<T>({
  queryKey,
  queryFn,
  initialLimit = 20,
  ...options
}: UsePaginatedQueryOptions<T>) {
  const [pagination, setPagination] = useState<PaginationState>({
    offset: 0,
    limit: initialLimit
  });

  const query = useQuery({
    queryKey: [...queryKey, pagination],
    queryFn: () => queryFn(pagination),
    ...options
  });

  const nextPage = () =>
    setPagination((prev) => ({ ...prev, offset: prev.offset + prev.limit }));
  const prevPage = () =>
    setPagination((prev) => ({
      ...prev,
      offset: Math.max(0, prev.offset - prev.limit)
    }));
  const goToPage = (page: number) =>
    setPagination((prev) => ({ ...prev, offset: page * prev.limit }));
  const setLimit = (limit: number) => setPagination({ offset: 0, limit });

  const page = Math.floor(pagination.offset / pagination.limit);

  return { ...query, pagination, page, nextPage, prevPage, goToPage, setLimit };
}

import { useMemo } from "react";

import { MutationCache, QueryCache, QueryClient, QueryClientConfig } from "@tanstack/react-query";

const defaultQueryCache = new QueryCache({
  onError: (error, query) => {
    if (query.meta?.errorMessage) {
      if (typeof query.meta.errorMessage === "function") {
        const message = query.meta.errorMessage(error, query);
        message && alert(message);
        return;
      }
      alert(query.meta.errorMessage as string);
      return;
    }
  },
});

const defaultMutationCache = new MutationCache({
  onError: (error, variables, context, mutation) => {
    if (mutation.meta?.errorMessage) {
      if (typeof mutation.meta.errorMessage === "function") {
        const message = mutation.meta?.errorMessage(error, variables, context, mutation);
        message && alert(message);
        return;
      }
      alert(mutation.meta.errorMessage as string);
      return;
    }
  },
  onSuccess: (data, variables, context, mutation) => {
    if (mutation.meta?.successMessage) {
      if (typeof mutation.meta.successMessage === "function") {
        const message = mutation.meta.successMessage(data, variables, context, mutation);
        message && alert(message);
        return;
      }
      alert(mutation.meta.successMessage as string);
      return;
    }
  },
});

export const QUERY_CACHE_TIME = 1000 * 60 * 60; // 1 hour

export const defaultQueryClientOptions = {
  defaultOptions: {
    queries: {
      gcTime: 0,
      staleTime: 0,
      refetchOnWindowFocus: false,
      retry: false,
      retryOnMount: false,
    },
  },
  queryCache: defaultQueryCache,
  mutationCache: defaultMutationCache,
};

export function queryClientFactory(options?: QueryClientConfig) {
  return new QueryClient({ ...defaultQueryClientOptions, ...options });
}

export const queryClient = queryClientFactory();

export function useQueryClientCacheOptions() {
  return useMemo(
    () => ({
      gcTime: QUERY_CACHE_TIME,
      staleTime: Number.POSITIVE_INFINITY,
    }),
    [],
  );
}

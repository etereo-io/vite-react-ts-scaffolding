import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { queryClient as defaultQueryClient } from "../queryClient";

export function AppProviders({
  children,
  queryClient = defaultQueryClient
}: {
  readonly children: React.ReactNode;
  readonly queryClient?: QueryClient;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

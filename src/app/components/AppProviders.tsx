import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { queryClient as defaultQueryClient } from "@/app/features/queryClient";
import { ConfigLoader } from "../features/config/components/ConfigLoader";
import { Config } from "../features/config/config.types";
import { ConfigProvider } from "../features/config/providers/ConfigProvider";

export function AppProviders({
  children,
  queryClient = defaultQueryClient,
  config = null
}: {
  readonly children: React.ReactNode;
  readonly queryClient?: QueryClient;
  readonly config?: Config | null;
}) {
  return (
    <ConfigProvider config={config}>
      <ConfigLoader>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ConfigLoader>
    </ConfigProvider>
  );
}

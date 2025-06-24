import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nLoader } from "@/app/features/i18n/components/I18nLoader";
import { queryClient as defaultQueryClient } from "@/app/features/queryClient";
import { ConfigLoader } from "../features/config/components/ConfigLoader";
import type { Config } from "../features/config/config.types";
import { ConfigProvider } from "../features/config/providers/ConfigProvider";
import { MockProvider } from "../features/mock-server/providers/MockProvider";

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
        <I18nLoader>
          <MockProvider>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </MockProvider>
        </I18nLoader>
      </ConfigLoader>
    </ConfigProvider>
  );
}

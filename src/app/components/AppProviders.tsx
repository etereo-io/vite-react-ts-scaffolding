import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import { AuthProvider } from "@/app/features/auth/providers/AuthProvider";
import { DebugProviders } from "@/app/features/debug/components/DebugProviders";
import { I18nLoader } from "@/app/features/i18n/components/I18nLoader";
import { IdleManagerLoader } from "@/app/features/idle/components/IdleManagerLoader";
import { queryClient as defaultQueryClient } from "@/app/features/queryClient";
import { AnalyticsLoader } from "@/lib/analytics/AnalyticsLoader";
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
        <AnalyticsLoader>
          <I18nLoader>
            <MockProvider>
              <AuthProvider>
                <QueryClientProvider client={queryClient}>
                  <IdleManagerLoader>
                    {children}
                    <Toaster richColors position="top-right" />
                    <DebugProviders />
                  </IdleManagerLoader>
                </QueryClientProvider>
              </AuthProvider>
            </MockProvider>
          </I18nLoader>
        </AnalyticsLoader>
      </ConfigLoader>
    </ConfigProvider>
  );
}

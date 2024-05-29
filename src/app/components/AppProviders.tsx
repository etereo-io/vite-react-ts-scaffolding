import { Theme, ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { queryClient as defaultQueryClient } from "@/lib/queryClient";
import { defaultTheme } from "@/lib/theme/theme";

export function AppProviders({
  children,
  queryClient = defaultQueryClient,
  theme = defaultTheme,
}: {
  children: React.ReactNode;
  queryClient?: QueryClient;
  theme?: Theme;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </QueryClientProvider>
  );
}

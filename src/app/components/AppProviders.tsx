import { ThemeProvider } from "@mui/material/styles";

import { defaultTheme } from "@/lib/theme/theme";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={defaultTheme}>{children}</ThemeProvider>;
}

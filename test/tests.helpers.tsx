import { MemoryRouter, RouterProvider, createMemoryRouter } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";
import { RenderOptions, render } from "@testing-library/react";

import { getAllRoutes } from "@/app/modules/modules.helpers";
import { defaultTheme } from "@/lib/theme/theme";

export function TestProviders({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={defaultTheme}>{children}</ThemeProvider>;
}

export function TestProvidersWithRouter({ children }: { children: React.ReactNode }) {
  return (
    <TestProviders>
      <MemoryRouter>{children}</MemoryRouter>
    </TestProviders>
  );
}

export function TestApp({ initialEntries }: { initialEntries?: string[] }) {
  const router = createMemoryRouter(getAllRoutes(), {
    initialEntries,
  });

  return (
    <TestProviders>
      <RouterProvider router={router} />
    </TestProviders>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function renderWithTestProviders(ui: React.ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: TestProvidersWithRouter, ...options });
}

import { MemoryRouter, RouterProvider, createMemoryRouter } from "react-router-dom";

import { RenderOptions, render } from "@testing-library/react";

import { AppProviders } from "@/app/components/AppProviders";
import { getAllRoutes } from "@/app/modules/modules.helpers";

export function TestProviders({ children }: { readonly children: React.ReactNode }) {
  return (
    <AppProviders>
      <MemoryRouter>{children}</MemoryRouter>
    </AppProviders>
  );
}

export function TestApp({ initialEntries }: { readonly initialEntries?: string[] }) {
  const router = createMemoryRouter(getAllRoutes(), {
    initialEntries,
  });

  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function renderWithTestProviders(ui: React.ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: TestProviders, ...options });
}

import { MemoryRouter, RouterProvider, createMemoryRouter } from "react-router";

import { RenderOptions, render } from "@testing-library/react";

import { AppProviders } from "@/app/components/AppProviders";
import { getAllRoutes } from "@/app/features/modules/modules.helpers";

import localConfig from "../config/config.local.yml";

export function TestProviders({
  children
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <AppProviders config={localConfig}>
      <MemoryRouter>{children}</MemoryRouter>
    </AppProviders>
  );
}

export function TestApp({
  initialEntries
}: {
  readonly initialEntries?: string[];
}) {
  const router = createMemoryRouter(getAllRoutes(), {
    initialEntries
  });

  return (
    <AppProviders config={localConfig}>
      <RouterProvider router={router} />
    </AppProviders>
  );
}

export function renderWithTestProviders(
  ui: React.ReactElement,
  options?: RenderOptions
) {
  return render(ui, { wrapper: TestProviders, ...options });
}

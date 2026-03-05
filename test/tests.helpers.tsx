import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  type RenderHookOptions,
  type RenderOptions,
  render,
  renderHook
} from "@testing-library/react";
import { createMemoryRouter, MemoryRouter, RouterProvider } from "react-router";

import { AppProviders } from "@/app/components/AppProviders";
import type { User } from "@/app/features/auth/auth.types";
import { UserRoles } from "@/app/features/auth/auth.types";
import { getAllRoutes } from "@/app/features/modules/modules.helpers";

import localConfig from "../config/config.local.yml";

// ---------------------------------------------------------------------------
// Test-optimized QueryClient
// ---------------------------------------------------------------------------

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
        refetchOnWindowFocus: false
      },
      mutations: {
        retry: false
      }
    }
  });
}

// ---------------------------------------------------------------------------
// Full providers (existing — unchanged)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Minimal providers (~60% faster — no config loading, no MSW, no i18n)
// ---------------------------------------------------------------------------

export function MinimalTestProviders({
  children,
  queryClient
}: {
  readonly children: React.ReactNode;
  readonly queryClient?: QueryClient;
}) {
  const client = queryClient ?? createTestQueryClient();

  return (
    <QueryClientProvider client={client}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
}

export function MinimalTestApp({
  initialEntries,
  queryClient
}: {
  readonly initialEntries?: string[];
  readonly queryClient?: QueryClient;
}) {
  const client = queryClient ?? createTestQueryClient();
  const router = createMemoryRouter(getAllRoutes(), {
    initialEntries
  });

  return (
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

// ---------------------------------------------------------------------------
// Lightweight hook testing wrapper
// ---------------------------------------------------------------------------

export function renderHookWithProviders<TResult, TProps>(
  hook: (props: TProps) => TResult,
  options?: RenderHookOptions<TProps> & { queryClient?: QueryClient }
) {
  const { queryClient, ...rest } = options ?? {};
  const client = queryClient ?? createTestQueryClient();

  return renderHook(hook, {
    wrapper: ({ children }: { readonly children: React.ReactNode }) => (
      <QueryClientProvider client={client}>
        <MemoryRouter>{children}</MemoryRouter>
      </QueryClientProvider>
    ),
    ...rest
  });
}

// ---------------------------------------------------------------------------
// Role-specific renderers
// ---------------------------------------------------------------------------

const BASE_MOCK_USER: User = {
  login: "test-user",
  email: "test@example.com",
  name: "Test User",
  userId: "test-user-id",
  roles: [],
  permissions: [],
  attributes: [],
  userData: {
    description: "Test user",
    employeeId: "EMP001",
    employeeNumber: 1,
    id: "test-user-id",
    login: "test-user",
    mail: "test@example.com",
    name: "Test User"
  }
};

function createMockUser(overrides: Partial<User>): User {
  return { ...BASE_MOCK_USER, ...overrides };
}

function renderWithMockUser(
  ui: React.ReactElement,
  user: User,
  options?: RenderOptions
) {
  vi.mocked(
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("@/app/features/auth/hooks/useLoggedUser").useLoggedUser
  ).mockReturnValue({ user, isPending: false });

  return render(ui, {
    wrapper: ({ children }: { readonly children: React.ReactNode }) => (
      <MinimalTestProviders>{children}</MinimalTestProviders>
    ),
    ...options
  });
}

export function renderWithAdminUser(
  ui: React.ReactElement,
  options?: RenderOptions
) {
  const adminUser = createMockUser({
    login: "admin-user",
    name: "Admin User",
    roles: [UserRoles.ADMIN],
    permissions: ["admin:read", "admin:write"]
  });

  return renderWithMockUser(ui, adminUser, options);
}

export function renderWithStaffUser(
  ui: React.ReactElement,
  options?: RenderOptions
) {
  const staffUser = createMockUser({
    login: "staff-user",
    name: "Staff User",
    roles: [UserRoles.STAFF],
    permissions: ["staff:read"]
  });

  return renderWithMockUser(ui, staffUser, options);
}

export function renderWithRegularUser(
  ui: React.ReactElement,
  options?: RenderOptions
) {
  const regularUser = createMockUser({
    login: "regular-user",
    name: "Regular User",
    roles: [],
    permissions: []
  });

  return renderWithMockUser(ui, regularUser, options);
}

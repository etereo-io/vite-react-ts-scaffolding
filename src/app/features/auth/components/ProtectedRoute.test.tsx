import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import { userMother } from "../__mocks__/user.mother";
import { UserRoles } from "../auth.types";
import { useAuth } from "../providers/AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";

vi.mock("@/app/features/auth/providers/AuthContext");

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    Navigate: (props: { to: string; replace?: boolean }) => {
      mockNavigate(props);
      return null;
    }
  };
});

describe("ProtectedRoute", () => {
  const mockUseAuth = vi.mocked(useAuth);

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  test("should render null while auth is pending", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isPending: true,
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: vi.fn()
    });

    const { container } = render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(container).toBeEmptyDOMElement();
  });

  test("should render custom loading component while auth is pending", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isPending: true,
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: vi.fn()
    });

    render(
      <MemoryRouter>
        <ProtectedRoute loadingComponent={<div>Loading...</div>}>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("should redirect to login when not authenticated", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isPending: false,
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: vi.fn()
    });

    render(
      <MemoryRouter initialEntries={["/admin/tasks/list"]}>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({ to: "/login", replace: true })
    );
  });

  test("should store redirect-after-login path in sessionStorage", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isPending: false,
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: vi.fn()
    });

    render(
      <MemoryRouter initialEntries={["/admin/tasks/list"]}>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(sessionStorage.getItem("auth_redirect_after_login")).toBe(
      "/admin/tasks/list"
    );
  });

  test("should render children when authenticated and no authorization rule", () => {
    mockUseAuth.mockReturnValue({
      user: userMother.getMockAdminUser(),
      isAuthenticated: true,
      isPending: false,
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: vi.fn()
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  test("should render Error403 when authenticated but not authorized", () => {
    mockUseAuth.mockReturnValue({
      user: userMother.getMockRegularUser({ permissions: [] }),
      isAuthenticated: true,
      isPending: false,
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: vi.fn()
    });

    render(
      <MemoryRouter>
        <ProtectedRoute authorization={{ requiredRoles: [UserRoles.ADMIN] }}>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByTestId("error-403-page")).toBeInTheDocument();
  });

  test("should render custom forbidden component when not authorized", () => {
    mockUseAuth.mockReturnValue({
      user: userMother.getMockRegularUser({ permissions: [] }),
      isAuthenticated: true,
      isPending: false,
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: vi.fn()
    });

    render(
      <MemoryRouter>
        <ProtectedRoute
          authorization={{ requiredPermissions: ["admin:all"] }}
          forbiddenComponent={<div>Custom Forbidden</div>}
        >
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText("Custom Forbidden")).toBeInTheDocument();
  });

  test("should render children when authorized via bypass permissions", () => {
    mockUseAuth.mockReturnValue({
      user: userMother.getMockAdminUser({
        permissions: ["admin:all"]
      }),
      isAuthenticated: true,
      isPending: false,
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: vi.fn()
    });

    render(
      <MemoryRouter>
        <ProtectedRoute
          authorization={{
            bypassPermissions: ["admin:all"],
            requiredPermissions: ["some:specific:permission"]
          }}
        >
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  test("should redirect to custom login path", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isPending: false,
      login: vi.fn(),
      logout: vi.fn(),
      refreshToken: vi.fn()
    });

    render(
      <MemoryRouter>
        <ProtectedRoute loginPath="/auth/signin">
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({ to: "/auth/signin", replace: true })
    );
  });
});

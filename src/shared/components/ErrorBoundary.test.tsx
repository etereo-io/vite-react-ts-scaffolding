import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import { ErrorBoundary } from "./ErrorBoundary";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

function ThrowingComponent(): never {
  throw new Error("Test error");
}

describe("ErrorBoundary", () => {
  // Suppress console.error for expected React error boundary logs
  const originalConsoleError = console.error;
  beforeEach(() => {
    console.error = vi.fn();
  });
  afterEach(() => {
    console.error = originalConsoleError;
  });

  test("should render children when no error occurs", () => {
    render(
      <MemoryRouter>
        <ErrorBoundary>
          <div>Normal Content</div>
        </ErrorBoundary>
      </MemoryRouter>
    );

    expect(screen.getByText("Normal Content")).toBeInTheDocument();
  });

  test("should render default Error500 fallback when child throws", () => {
    render(
      <MemoryRouter>
        <ErrorBoundary>
          <ThrowingComponent />
        </ErrorBoundary>
      </MemoryRouter>
    );

    expect(screen.getByTestId("error-500-page")).toBeInTheDocument();
  });

  test("should render custom fallback when child throws", () => {
    render(
      <MemoryRouter>
        <ErrorBoundary
          fallback={<div data-testid="custom-fallback">Custom Error</div>}
        >
          <ThrowingComponent />
        </ErrorBoundary>
      </MemoryRouter>
    );

    expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
  });

  test("should render fallback when error prop is truthy", () => {
    render(
      <MemoryRouter>
        <ErrorBoundary error={new Error("forced error")}>
          <div>Normal Content</div>
        </ErrorBoundary>
      </MemoryRouter>
    );

    expect(screen.getByTestId("error-500-page")).toBeInTheDocument();
    expect(screen.queryByText("Normal Content")).not.toBeInTheDocument();
  });

  test("should render children when error prop is falsy", () => {
    render(
      <MemoryRouter>
        <ErrorBoundary error={null}>
          <div>Normal Content</div>
        </ErrorBoundary>
      </MemoryRouter>
    );

    expect(screen.getByText("Normal Content")).toBeInTheDocument();
  });
});

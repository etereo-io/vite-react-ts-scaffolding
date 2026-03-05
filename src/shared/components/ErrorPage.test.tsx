import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import { ErrorPage } from "./ErrorPage";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

describe("ErrorPage", () => {
  test("should render with the correct testid", () => {
    render(
      <MemoryRouter>
        <ErrorPage
          errorType="403"
          errorTitle="Test Title"
          errorDescription="Test Description"
        />
      </MemoryRouter>
    );

    expect(screen.getByTestId("error-403-page")).toBeInTheDocument();
  });

  test("should render title and description", () => {
    render(
      <MemoryRouter>
        <ErrorPage
          errorType="404"
          errorTitle="Not Found"
          errorDescription="Page does not exist"
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Not Found")).toBeInTheDocument();
    expect(screen.getByText("Page does not exist")).toBeInTheDocument();
  });

  test("should render default go back button when no footer provided", () => {
    render(
      <MemoryRouter>
        <ErrorPage
          errorType="500"
          errorTitle="Error"
          errorDescription="Something went wrong"
        />
      </MemoryRouter>
    );

    expect(screen.getByText("shared.error.button.goBack")).toBeInTheDocument();
  });

  test("should render custom footer when provided", () => {
    render(
      <MemoryRouter>
        <ErrorPage
          errorType="403"
          errorTitle="Denied"
          errorDescription="No access"
          footer={<button type="button">Custom Action</button>}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Custom Action")).toBeInTheDocument();
    expect(
      screen.queryByText("shared.error.button.goBack")
    ).not.toBeInTheDocument();
  });

  test("should match snapshot", () => {
    const { container } = render(
      <MemoryRouter>
        <ErrorPage
          errorType="403"
          errorTitle="Access Denied"
          errorDescription="You do not have permission"
        />
      </MemoryRouter>
    );

    expect(container).toMatchSnapshot();
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { renderWithTestProviders, TestApp } from "#/tests.helpers";
import { SignInPage } from "./SignInPage";

describe("SignInPage", () => {
  it("should render", async () => {
    const { container } = render(<TestApp initialEntries={["/login"]} />);

    expect(screen.getByTestId("login-page")).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it("should render alternative", async () => {
    const { container } = renderWithTestProviders(<SignInPage />);

    expect(screen.getByTestId("login-page")).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it("should navigate to /admin/dashboard", async () => {
    render(<TestApp initialEntries={["/login"]} />);

    await act(() => userEvent.click(screen.getByText("Sign In")));

    expect(screen.getByTestId("dashboard-page")).toBeInTheDocument();
  });
});

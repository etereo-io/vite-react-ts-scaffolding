import { act } from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SignInSide } from "./SignInSide";

import { TestApp, renderWithTestProviders } from "#/tests.helpers";

describe("SignInSide", () => {
  it("should render", async () => {
    const { container } = render(<TestApp initialEntries={["/admin/login"]} />);

    expect(screen.getByTestId("login-page")).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it("should render alternative", async () => {
    const { container } = renderWithTestProviders(<SignInSide />);

    expect(screen.getByTestId("login-page")).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  it("should navigate to /admin/dashboard", async () => {
    render(<TestApp initialEntries={["/admin/login"]} />);

    await act(() => userEvent.click(screen.getByText("Sign In")));

    expect(screen.getByTestId("dashboard-page")).toBeInTheDocument();
  });
});

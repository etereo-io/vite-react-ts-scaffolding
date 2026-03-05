import { screen } from "@testing-library/react";
import { renderWithTestProviders } from "#/tests.helpers";
import { SignInPage } from "./SignInPage";

describe("SignInPage", () => {
  it("should render", async () => {
    const { container } = renderWithTestProviders(<SignInPage />);

    expect(screen.getByTestId("login-page")).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });
});

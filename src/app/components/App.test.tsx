import { render, screen } from "@testing-library/react";

import { App } from "./App";

describe("App", () => {
  test("should render login by default", () => {
    const { container } = render(<App />);

    expect(screen.getByTestId("login-page")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});

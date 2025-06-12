import { render, screen } from "@testing-library/react";

import { App } from "./App";

import localConfig from "../../../config/config.local.yml";

describe("App", () => {
  test("should render login by default", () => {
    const { container } = render(<App config={localConfig} />);

    expect(screen.getByTestId("login-page")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});

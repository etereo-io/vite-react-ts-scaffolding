import { render, screen } from "@testing-library/react";
import localConfig from "../../../config/config.local.yml";
import { App } from "./App";

describe("App", () => {
  test("should render login by default", async () => {
    const { container } = render(<App config={localConfig} />);

    expect(await screen.findByTestId("login-page")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});

import { screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";

import { server } from "@/mock-server/node";

import { DepositList } from "./DepositList";
import { DepositMother } from "../__mocks__/DepositMother";

import { renderWithTestProviders } from "#/tests.helpers";

vi.mock("react-i18next", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useTranslation: () => ({ t: (key: any) => key }),
}));

describe("DepositList", () => {
  const deposits = DepositMother.getRandomList();

  beforeEach(() => {
    //server mock return data
    server.use(
      http.get("/api/deposits", () =>
        HttpResponse.json({
          data: deposits,
        }),
      ),
    );
  });

  it("renders table correctly with deposits", async () => {
    const { container } = renderWithTestProviders(<DepositList />);

    // Verify colums title
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText(deposits[0].name)).toBeInTheDocument());
    expect(container.querySelectorAll('[aria-label="delete"]')).toHaveLength(10);
  });
});

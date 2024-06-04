import { screen, waitFor } from "@testing-library/react";
import { Mock } from "vitest";

import { UserMother } from "@/auth/__mocks__/UserMother";
import { useLoggedUser } from "@/auth/hooks/useLoggedUser";

import { OrdersPage } from "./OrdersPage";

import { renderWithTestProviders } from "#/tests.helpers";

vi.mock("@/auth/hooks/useLoggedUser", () => ({
  useLoggedUser: vi.fn(),
}));

describe("OrdersPage", () => {
  it("should render Orders", async () => {
    (useLoggedUser as Mock).mockImplementation(() => {
      return {
        user: UserMother.getMockUser(),
        isPending: false,
      };
    });
    renderWithTestProviders(<OrdersPage />);
    await waitFor(() => expect(screen.getByTestId("orders-table")).toBeInTheDocument());
  });

  it("should not render Orders", async () => {
    (useLoggedUser as Mock).mockImplementation(() => {
      return {
        user: UserMother.getMockUser({ permissions: [] }),
        isPending: false,
      };
    });

    renderWithTestProviders(<OrdersPage />);
    await waitFor(() => expect(screen.queryByTestId("orders-table")).not.toBeInTheDocument());
  });
});

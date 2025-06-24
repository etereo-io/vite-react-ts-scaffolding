import { screen, waitFor } from "@testing-library/react";
import type { Mock } from "vitest";
import { renderWithTestProviders } from "#/tests.helpers";
import { userMother } from "@/app/features/auth/__mocks__/user.mother";
import { useLoggedUser } from "@/app/features/auth/hooks/useLoggedUser";
import { OrdersPage } from "./OrdersPage";

vi.mock("@/app/features/auth/hooks/useLoggedUser", () => ({
  useLoggedUser: vi.fn()
}));

describe("OrdersPage", () => {
  it("should render Orders", async () => {
    (useLoggedUser as Mock).mockImplementation(() => {
      return {
        user: userMother.getMockUser(),
        isPending: false
      };
    });
    renderWithTestProviders(<OrdersPage />);
    await waitFor(() =>
      expect(screen.getByTestId("orders-table")).toBeInTheDocument()
    );
  });

  it("should not render Orders", async () => {
    (useLoggedUser as Mock).mockImplementation(() => {
      return {
        user: userMother.getMockUser({ permissions: [] }),
        isPending: false
      };
    });

    renderWithTestProviders(<OrdersPage />);
    await waitFor(() =>
      expect(screen.queryByTestId("orders-table")).not.toBeInTheDocument()
    );
  });
});

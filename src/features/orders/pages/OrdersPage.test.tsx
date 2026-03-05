import { screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import type { Mock } from "vitest";
import { renderWithTestProviders } from "#/tests.helpers";
import { API_MOCK_PREFIX } from "@/app/features/api/api.constants";
import { userMother } from "@/app/features/auth/__mocks__/user.mother";
import { useLoggedUser } from "@/app/features/auth/hooks/useLoggedUser";
import { server } from "@/app/features/mock-server/node";
import { orderMother } from "../__mocks__/order.mother";
import { PERMISSION_ORDERS_LIST } from "../orders.constants";
import { OrdersPage } from "./OrdersPage";

vi.mock("@/app/features/auth/hooks/useLoggedUser", () => ({
  useLoggedUser: vi.fn()
}));

describe("OrdersPage", () => {
  beforeEach(() => {
    server.use(
      http.get(`${API_MOCK_PREFIX}/api/v1/orders`, () =>
        HttpResponse.json({
          data: orderMother.getRandomList(),
          pagination: {
            offset: 0,
            limit: 20,
            count: 100,
            hasMore: true
          }
        })
      )
    );
  });

  it("should render Orders", async () => {
    (useLoggedUser as Mock).mockImplementation(() => {
      return {
        user: userMother.getMockUser({
          permissions: [PERMISSION_ORDERS_LIST]
        }),
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

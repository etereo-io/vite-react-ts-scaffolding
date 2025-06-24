import { screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import type { Mock } from "vitest";
import { renderWithTestProviders } from "#/tests.helpers";
import { UserMother } from "@/app/features/auth/__mocks__/UserMother";
import { useLoggedUser } from "@/app/features/auth/hooks/useLoggedUser";
import { server } from "@/app/features/mock-server/node";
import { OrderMother } from "../__mocks__/OrderMother";
import { Orders } from "./Orders";

vi.mock("@/app/features/auth/hooks/useLoggedUser");

describe("Orders", () => {
  const orders = OrderMother.getRandomList();

  beforeEach(() => {
    server.use(
      http.get("/api/orders", () =>
        HttpResponse.json({
          data: orders,
          pagination: {
            offset: 0,
            limit: 10,
            count: 100,
            hasMore: true
          }
        })
      )
    );
  });

  it("render delete button", async () => {
    (useLoggedUser as Mock).mockImplementation(() => ({
      user: UserMother.getMockUser()
    }));

    const { container } = renderWithTestProviders(<Orders />);
    await waitFor(() =>
      expect(screen.getByText(orders[0].name)).toBeInTheDocument()
    );
    expect(container.querySelectorAll('[aria-label="delete"]')).toHaveLength(
      20
    );
  });

  it("not render delete button", async () => {
    (useLoggedUser as Mock).mockImplementation(() => ({
      user: UserMother.getMockUser({
        permissions: []
      })
    }));

    const { container } = renderWithTestProviders(<Orders />);
    await waitFor(() =>
      expect(screen.getByText(orders[0].name)).toBeInTheDocument()
    );
    expect(container.querySelectorAll('[aria-label="delete"]')).toHaveLength(0);
  });
});

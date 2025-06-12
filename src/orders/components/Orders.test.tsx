import { screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { Mock } from "vitest";

import { UserMother } from "@/auth/__mocks__/UserMother";
import { useLoggedUser } from "@/auth/hooks/useLoggedUser";
import { server } from "@/mock-server/node";

import { OrderMother } from "../__mocks__/OrderMother";
import { Orders } from "./Orders";

import { renderWithTestProviders } from "#/tests.helpers";

vi.mock("@/auth/hooks/useLoggedUser");

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
            hasMore: true,
          },
        }),
      ),
    );
  });

  it("render delete button", async () => {
    (useLoggedUser as Mock).mockImplementation(() => ({
      user: UserMother.getMockUser(),
    }));

    const { container } = renderWithTestProviders(<Orders />);
    await waitFor(() =>
      expect(screen.getByText(orders[0].name)).toBeInTheDocument(),
    );
    expect(container.querySelectorAll('[aria-label="delete"]')).toHaveLength(
      20,
    );
  });

  it("not render delete button", async () => {
    (useLoggedUser as Mock).mockImplementation(() => ({
      user: UserMother.getMockUser({
        permissions: [],
      }),
    }));

    const { container } = renderWithTestProviders(<Orders />);
    await waitFor(() =>
      expect(screen.getByText(orders[0].name)).toBeInTheDocument(),
    );
    expect(container.querySelectorAll('[aria-label="delete"]')).toHaveLength(0);
  });
});

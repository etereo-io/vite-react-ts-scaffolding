import { renderHook, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";

import { server } from "@/mock-server/node";

import { useOrders } from "./useOrders";
import { OrderMother } from "../__mocks__/OrderMother";

import { TestProviders } from "#/tests.helpers";

describe("useOrders", () => {
  const data = OrderMother.getRandomPage();

  beforeEach(() => {
    // override already mocked endpoint
    server.use(http.get("/api/orders", () => HttpResponse.json({ data })));
  });

  it("should return data", async () => {
    const { result } = renderHook(() => useOrders(), { wrapper: TestProviders });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(result.current.data).toStrictEqual(data);
  });
});

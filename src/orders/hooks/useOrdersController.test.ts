import { act, renderHook, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, test, expect, beforeEach } from "vitest";

import { API_DEFAULT_LIMIT } from "@/app/api";
import { server } from "@/mock-server/node";

import { useOrdersController } from "./useOrdersController";
import { OrderMother } from "../__mocks__/OrderMother";

import { TestProviders } from "#/tests.helpers";

describe("useOrdersController", () => {
  const orderPage = {
    data: OrderMother.getRandomPage(),
    pagination: {
      offset: 0,
      limit: API_DEFAULT_LIMIT,
      count: 100,
      hasMore: true,
    },
  };
  beforeEach(() => {
    server.use(http.get("/api/orders", () => HttpResponse.json(orderPage)));
  });

  test("should handle pagination change", async () => {
    const { result } = renderHook(() => useOrdersController(), {
      wrapper: TestProviders,
    });

    await waitFor(() => expect(result.current.page).toBe(1));

    server.use(
      http.get("/api/orders", () =>
        HttpResponse.json({ ...orderPage, pagination: { ...orderPage.pagination, offset: 10 } }),
      ),
    );

    act(() => {
      result.current.handleOnPaginationChange({}, 2);
    });

    await waitFor(() => expect(result.current.page).toBe(2));
  });

  test("should handle order delete", async () => {
    const { result } = renderHook(() => useOrdersController(), {
      wrapper: TestProviders,
    });

    act(() => {
      result.current.handleOrderDelete("order-1")();
    });

    await waitFor(() => expect(result.current.mutation.isPending).toBe(false));
  });

  test("should handle see more orders", () => {
    const preventDefaultMock = vi.fn();
    const { result } = renderHook(() => useOrdersController(), {
      wrapper: TestProviders,
    });

    act(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result.current.handleSeeMoreOrders({ preventDefault: preventDefaultMock } as any);
    });

    expect(preventDefaultMock).toHaveBeenCalled();
  });

  test("should calculate page correctly", async () => {
    const { result } = renderHook(() => useOrdersController(), {
      wrapper: TestProviders,
    });

    await waitFor(() => expect(result.current.orders?.pagination.limit).toBe(orderPage.pagination.limit));

    await waitFor(() =>
      expect(result.current.page).toBe(Math.floor(orderPage.pagination.offset / orderPage.pagination.limit) + 1),
    );
  });
});

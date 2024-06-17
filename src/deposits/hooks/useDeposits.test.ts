import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";

import { server } from "@/mock-server/node";

import { useDeposits } from "./useDeposits";
import { DepositsMother } from "../__mocks__/DepositsMother";

import { TestProviders } from "#/tests.helpers";

const mockNotificationError = vi.fn();
vi.mock("@/lib/notifications/notifications", () => ({
  notifications: {
    error: (...args: unknown[]) => mockNotificationError(...args),
  },
}));

describe("useDeposit", () => {
  const data = DepositsMother.getRandomList();

  beforeEach(() => {
    //server mock return data
    server.use(
      http.get("/api/deposits", () =>
        HttpResponse.json({
          data,
        }),
      ),
    );
  });

  it("fetches deposits successfully", async () => {
    const { result } = renderHook(() => useDeposits(), { wrapper: TestProviders });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(result.current.data?.data).toStrictEqual(data);
  });

  it("should notify on error", async () => {
    //server mock return error
    server.use(http.get("/api/deposits", () => HttpResponse.error()));
    const { result } = renderHook(() => useDeposits(), { wrapper: TestProviders });

    await waitFor(() => expect(result.current.isError).toBeTruthy());
    expect(mockNotificationError).toHaveBeenCalledTimes(1);
  });
});

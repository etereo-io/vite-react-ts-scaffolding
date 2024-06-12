import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";

import { server } from "@/mock-server/node";

import { useDeposit } from "./useDeposit";
import { DepositMother } from "../__mocks__/DepositMother";

import { TestProviders } from "#/tests.helpers";

const mockNotificationError = vi.fn();
vi.mock("@/lib/notifications/notifications", () => ({
  notifications: {
    error: (...args: unknown[]) => mockNotificationError(...args),
  },
}));

describe("useDeposit", () => {
  const data = DepositMother.getRandomList();

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
    const { result } = renderHook(() => useDeposit(), { wrapper: TestProviders });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(result.current.data?.data).toStrictEqual(data);
  });

  it("should notify on error", async () => {
    //server mock return error
    server.use(http.get("/api/deposits", () => HttpResponse.error()));
    const { result } = renderHook(() => useDeposit(), { wrapper: TestProviders });

    await waitFor(() => expect(result.current.isError).toBeTruthy());
    expect(mockNotificationError).toHaveBeenCalledTimes(1);
  });
});

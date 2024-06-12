import { act, renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe } from "vitest";

import { server } from "@/mock-server/node";

import { useDepositsControllers } from "./useDepositsControllers";
import { DepositsMother } from "../__mocks__/DepositsMother";

import { TestProviders } from "#/tests.helpers";

describe("useDepositControllers", () => {
  const deposits = DepositsMother.getRandomList();
  // const expectedTotalAmount = deposits.reduce((acc, deposit) => acc + parseFloat(deposit.amount), 0);

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

  // it("should calculate totalAmount correctly", async () => {
  //   const { result } = renderHook(() => useDepositsControllers(), { wrapper: TestProviders });
  //   console.log("🚀 --------- result", result);

  //   expect(result.current.totalAmount).toBe(expectedTotalAmount);
  // });

  it("should call mutation.mutate when handleDepositDelete is called", async () => {
    const { result } = renderHook(() => useDepositsControllers(), { wrapper: TestProviders });

    act(() => {
      result.current.handleDepositDelete("depositId")();
    });

    await waitFor(() => expect(result.current.mutation.isPending).toBe(false));
  });
});

import { delay, http, HttpResponse } from "msw";

import { DEFAULT_DELAY } from "@/mock-server/constants";

import { DepositsMother } from "./__mocks__/DepositsMother";
import { ERROR_DEPOSITID_REQUIRED } from "./deposits.constants";

const deposits = DepositsMother.getRandomList();

export const handlers = [
  http.get("/api/deposits", async () => {
    await delay(DEFAULT_DELAY);

    return HttpResponse.json({
      data: deposits,
    });
  }),

  http.delete("/api/deposits/:depositId", async ({ params }) => {
    const depositId = params.depositId;

    if (!depositId) {
      return HttpResponse.json(
        {
          code: ERROR_DEPOSITID_REQUIRED,
          message: "depositId is required",
        },
        { status: 400 },
      );
    }

    const index = deposits.findIndex((deposit) => deposit.id === depositId);
    if (index > -1) {
      deposits.splice(index, 1);
    }

    await delay(DEFAULT_DELAY);
    return new HttpResponse(null, { status: 204 });
  }),
];
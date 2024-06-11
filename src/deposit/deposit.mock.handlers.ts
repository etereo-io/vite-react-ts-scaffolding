import { delay, http, HttpResponse } from "msw";

import { DEFAULT_DELAY } from "@/mock-server/constants";

import { DepositMother } from "./__mocks__/DepositMother";

const deposits = DepositMother.getRandomList();

export const handlers = [
  http.get("/api/deposits", async () => {
    await delay(DEFAULT_DELAY);

    return HttpResponse.json({
      data: deposits,
    });
  }),

  http.delete("/api/deposits/:depositId", async ({ params }) => {
    const depositId = params.depositId;
    const index = deposits.findIndex((deposit) => deposit.id === depositId);
    if (index > -1) {
      deposits.splice(index, 1);
    }

    await delay(DEFAULT_DELAY);
    return new HttpResponse(null, { status: 204 });
  }),
];

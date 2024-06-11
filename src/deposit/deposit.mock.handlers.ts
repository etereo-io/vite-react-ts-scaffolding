import { delay, http, HttpResponse } from "msw";

import { DEFAULT_DELAY } from "@/mock-server/constants";

import { DepositMother } from "./__mocks__/DepositMother";

const deposit = DepositMother.getRandomList();

export const handlers = [
  http.get("/api/deposits", async () => {
    await delay(DEFAULT_DELAY);

    return HttpResponse.json({
      data: deposit,
    });
  }),
];

import { delay, http, HttpResponse } from "msw";

import { API_DEFAULT_LIMIT } from "@/app/api";
import { queryToObject } from "@/lib/queryparams/queryparams.helpers";
import { DEFAULT_DELAY } from "@/mock-server/constants";

import { OrderMother } from "./__mocks__/OrderMother";

const orders = OrderMother.getRandomList(100);

export const handlers = [
  http.get("/api/orders", async ({ request }) => {
    const query = queryToObject(request.url?.split("?")[1] ?? "");

    const offset = +(query.offset ?? 0);
    const limit = +(query.limit ?? API_DEFAULT_LIMIT);

    await delay(DEFAULT_DELAY);
    return HttpResponse.json({
      data: orders.slice(offset, limit),
    });
  }),

  http.delete("/api/orders/:orderId", async ({ params }) => {
    const orderId = params.orderId;

    if (!orderId) {
      return HttpResponse.json(
        {
          code: "required:orderId",
          message: "orderId is required",
        },
        { status: 400 },
      );

      return;
    }

    const orderIndex = orders.findIndex((order) => order.id === orderId);
    orders.splice(orderIndex, 1);

    await delay(DEFAULT_DELAY);
    return HttpResponse.json(null, { status: 204 });
  }),
];

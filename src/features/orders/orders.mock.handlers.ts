import { delay, HttpResponse, http } from "msw";

import { API_DEFAULT_LIMIT } from "@/app/features/api/api.contants";
import { DEFAULT_DELAY } from "@/app/features/mock-server/constants";
import { queryToObject } from "@/lib/queryparams/queryparams.helpers";

import { OrderMother } from "./__mocks__/OrderMother";
import { ERROR_ORDERID_REQUIRED } from "./orders.constants";

const orders = OrderMother.getRandomList(100);

export const handlers = [
  http.get("/api/orders", async ({ request }) => {
    const query = queryToObject(request.url?.split("?")[1] ?? "");

    const offset = +(query.offset ?? 0);
    const limit = +(query.limit ?? API_DEFAULT_LIMIT);
    const status = query.status;

    await delay(DEFAULT_DELAY);
    return HttpResponse.json({
      data: orders
        .filter((order) => (status ? order.status === status : true))
        .slice(offset, offset + limit),
      pagination: {
        offset,
        limit,
        count: orders.length,
        hasMore: orders.length > offset + limit
      }
    });
  }),

  http.delete("/api/orders/:orderId", async ({ params }) => {
    const orderId = params.orderId;

    if (!orderId) {
      return HttpResponse.json(
        {
          code: ERROR_ORDERID_REQUIRED,
          message: "orderId is required"
        },
        { status: 400 }
      );
    }

    const orderIndex = orders.findIndex((order) => order.id === orderId);
    if (orderIndex === -1) {
      orders.splice(orderIndex, 1);
    }

    await delay(DEFAULT_DELAY);
    return new HttpResponse(null, { status: 204 });
  })
];

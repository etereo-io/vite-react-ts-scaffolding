import { delay, HttpResponse, http } from "msw";

import {
  API_DEFAULT_LIMIT,
  API_MOCK_PREFIX
} from "@/app/features/api/api.contants";
import { DEFAULT_DELAY } from "@/app/features/mock-server/constants";
import { queryToObject } from "@/lib/queryparams/queryparams.helpers";

import { orderMother } from "./__mocks__/order.mother";
import { ERROR_ORDERID_REQUIRED } from "./orders.constants";

const orders = orderMother.getRandomList(100);

export function buildOrdersPathHandler() {
  return http.get(`${API_MOCK_PREFIX}/api/v1/orders`, async ({ request }) => {
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
  });
}

export function buildOrdersDeleteHandler() {
  return http.delete(
    `${API_MOCK_PREFIX}/api/v1/orders/:orderId`,
    async ({ params }) => {
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
    }
  );
}

export const getMockHandlers = () => [
  buildOrdersPathHandler(),
  buildOrdersDeleteHandler()
];

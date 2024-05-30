import { API_DEFAULT_LIMIT, PaginatedResponse, getEndpoint } from "@/app/api";
import { getQueryString } from "@/lib/queryparams/queryparams.helpers";

import { Order } from "./orders.types";

export function fetchOrders(offset = 0, limit = API_DEFAULT_LIMIT) {
  return fetch(
    getEndpoint() +
      "orders?" +
      getQueryString({
        offset,
        limit,
      }),
  ).then((res) => res.json() as Promise<PaginatedResponse<Order[]>>);
}

export function deleteOrder(orderId: string) {
  return fetch(getEndpoint() + `orders/${orderId}`, {
    method: "DELETE",
  });
}

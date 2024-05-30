import { ApiListResponse, getEndpoint } from "@/app/api";

import { Order } from "./orders.types";

export function fetchOrders() {
  return fetch(getEndpoint() + "orders")
    .then((res) => res.json() as Promise<ApiListResponse<Order[]>>)
    .then((res) => res.data);
}

export function deleteOrder(orderId: string) {
  return fetch(getEndpoint() + `orders/${orderId}`, {
    method: "DELETE",
  });
}

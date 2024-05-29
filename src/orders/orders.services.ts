import { getEndpoint } from "@/lib/api";

import { Order } from "./orders.types";

export function fetchOrders() {
  return fetch(getEndpoint() + "orders").then((res) => res.json() as Promise<Order[]>);
}

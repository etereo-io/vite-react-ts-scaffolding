import axios from "axios";

import { API_DEFAULT_LIMIT, PaginatedResponse, getEndpoint } from "@/app/api";
import { getQueryString } from "@/lib/queryparams/queryparams.helpers";

import { DEFAULT_ORDERS_FILTERS } from "./orders.constants";
import { Order, OrdersFilters } from "./orders.types";

export function fetchOrders(
  filters: OrdersFilters = {
    offset: 0,
    limit: API_DEFAULT_LIMIT
  }
) {
  const finalParams = Object.assign(
    {},
    DEFAULT_ORDERS_FILTERS,
    filters
  ) as unknown as Record<string, unknown>;
  return axios
    .get<PaginatedResponse<Order[]>>(
      getEndpoint() + "orders?" + getQueryString(finalParams)
    )
    .then((res) => res.data);
}

export function deleteOrder(orderId: string) {
  return axios.delete(getEndpoint() + `orders/${orderId}`, {
    method: "DELETE"
  });
}

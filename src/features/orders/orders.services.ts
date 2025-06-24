import axios from "axios";

import { getEndpoint } from "@/app/features/api/api";
import {
  API_DEFAULT_LIMIT,
  API_ENDPOINT_DEFAULT
} from "@/app/features/api/api.contants";
import type { PaginatedResponse } from "@/app/features/api/api.types";
import { getQueryString } from "@/lib/queryparams/queryparams.helpers";
import { DEFAULT_ORDERS_FILTERS } from "./orders.constants";
import type { Order, OrdersFilters } from "./orders.types";

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
      getEndpoint(API_ENDPOINT_DEFAULT) +
        "orders?" +
        getQueryString(finalParams)
    )
    .then((res) => res.data);
}

export function deleteOrder(orderId: string) {
  return axios.delete(`${getEndpoint(API_ENDPOINT_DEFAULT)}orders/${orderId}`, {
    method: "DELETE"
  });
}

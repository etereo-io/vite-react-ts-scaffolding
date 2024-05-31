import axios from "axios";

import { API_DEFAULT_LIMIT, PaginatedResponse, getEndpoint } from "@/app/api";
import { getQueryString } from "@/lib/queryparams/queryparams.helpers";

import { Order } from "./orders.types";

export function fetchOrders(offset = 0, limit = API_DEFAULT_LIMIT) {
  return axios
    .get<PaginatedResponse<Order[]>>(
      getEndpoint() +
        "orders?" +
        getQueryString({
          offset,
          limit,
        }),
    )
    .then((res) => res.data);
}

export function deleteOrder(orderId: string) {
  return axios.delete(getEndpoint() + `orders/${orderId}`, {
    method: "DELETE",
  });
}

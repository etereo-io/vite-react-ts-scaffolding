import { API_DEFAULT_LIMIT } from "@/app/api";

export const MODULE_ORDERS = "orders";

export const QUERY_KEY_ORDERS = "orders";

export const EVENT_ORDER_DELETE = "order_delete";

export const ERROR_ORDERID_REQUIRED = "error:required:orderId";

export const PERMISSION_ORDERS_LIST = "orders:list";
export const PERMISSION_ORDERS_VIEW = "orders:view";
export const PERMISSION_ORDERS_DELETE = "orders:delete";

export const QUERY_PARAM_ORDERS_STATUS = "status";

export const DEFAULT_ORDERS_FILTERS = {
  offset: 0,
  limit: API_DEFAULT_LIMIT,
};

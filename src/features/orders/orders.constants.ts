import { API_DEFAULT_LIMIT } from "@/app/features/api/api.constants";

export const MODULE_ORDERS = "orders";

export const QUERY_KEY_ORDERS = "orders";

export const orderKeys = {
  all: [QUERY_KEY_ORDERS] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const
};

export const EVENT_ORDER_DELETE = "order_delete";

export const ERROR_ORDERID_REQUIRED = "error:required:orderId";

export const PERMISSION_ORDERS_LIST = "orders:list";
export const PERMISSION_ORDERS_VIEW = "orders:view";
export const PERMISSION_ORDERS_DELETE = "orders:delete";

export const QUERY_PARAM_ORDERS_STATUS = "status";

export const DEFAULT_ORDERS_FILTERS = {
  offset: 0,
  limit: API_DEFAULT_LIMIT
};

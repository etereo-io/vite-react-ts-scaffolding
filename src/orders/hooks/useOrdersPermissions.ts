import { useUserAuth } from "@/auth/hooks/useUserAuth";

import {
  PERMISSION_ORDERS_DELETE,
  PERMISSION_ORDERS_LIST,
  PERMISSION_ORDERS_VIEW,
} from "../orders.constants";

export function useOrdersPermissions() {
  const { isAllowed, isPending } = useUserAuth();

  const canList = isAllowed(PERMISSION_ORDERS_LIST);
  const canView = isAllowed(PERMISSION_ORDERS_VIEW);
  const canDelete = isAllowed(PERMISSION_ORDERS_DELETE);

  return {
    isPending,
    canList,
    canView,
    canDelete,
  };
}

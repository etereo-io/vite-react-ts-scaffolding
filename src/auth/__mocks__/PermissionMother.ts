import { PERMISSION_ORDERS_DELETE, PERMISSION_ORDERS_LIST, PERMISSION_ORDERS_VIEW } from "@/orders/orders.constants";

export class PermissionMother {
  static getAll() {
    return [PERMISSION_ORDERS_LIST, PERMISSION_ORDERS_VIEW, PERMISSION_ORDERS_DELETE];
  }
}

import { ShoppingCart } from "lucide-react";
import type { RouteObject } from "react-router";

import type { MenuItem } from "@/app/app.types";
import { type User, UserRoles } from "@/app/features/auth/auth.types";
import { registerModule } from "@/app/features/modules/modules.helpers";
import { queryToObject } from "@/lib/queryparams/queryparams.helpers";
import { AdminLayout } from "@/shared/layouts/AdminLayout";

import { locales } from "./assets/locales";
import {
  MODULE_ORDERS,
  PERMISSION_ORDERS_DELETE,
  PERMISSION_ORDERS_LIST,
  PERMISSION_ORDERS_VIEW
} from "./orders.constants";
import { getMockHandlers } from "./orders.mock.handlers";
import { OrderStatus } from "./orders.types";
import { OrdersPage } from "./pages/OrdersPage";

const routes: RouteObject[] = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "orders",
        element: <OrdersPage />
      }
    ]
  }
];

const menuItems: MenuItem[] = [
  {
    title: "orders.title",
    path: "/admin/orders",
    icon: <ShoppingCart className="w-5 h-5" />,
    isAllowed: (user: User) =>
      Object.values(UserRoles).some((role) => user.roles.includes(role)),
    children: [
      {
        title: "orders.open.title",
        path: `/admin/orders?status=${OrderStatus.PENDING}`,
        isActive: (location) =>
          location.pathname.includes("/admin/orders") &&
          queryToObject(location.search).status === OrderStatus.PENDING,
        isAllowed: (user: User) =>
          Object.values(UserRoles).some((role) => user.roles.includes(role))
      },
      {
        title: "orders.closed.title",
        path: `/admin/orders?status=${OrderStatus.CLOSED}`,
        isActive: (location) =>
          location.pathname.includes("/admin/orders") &&
          queryToObject(location.search).status === OrderStatus.CLOSED,
        isAllowed: (user: User) =>
          Object.values(UserRoles).some((role) => user.roles.includes(role))
      }
    ]
  }
];

registerModule({
  name: MODULE_ORDERS,
  routes,
  menuItems,
  locales,
  getMockHandlers,
  permissions: [
    PERMISSION_ORDERS_LIST,
    PERMISSION_ORDERS_VIEW,
    PERMISSION_ORDERS_DELETE
  ]
});

import { RouteObject } from "react-router";

import { ShoppingCart } from "lucide-react";

import { MenuItem } from "@/app/app.types";
import { registerModule } from "@/app/modules/modules.helpers";
import { User, UserRoles } from "@/auth/auth.types";
import { queryToObject } from "@/lib/queryparams/queryparams.helpers";
import { AdminLayout } from "@/shared/layouts/AdminLayout";

import locales from "./assets/locales";
import {
  MODULE_ORDERS,
  PERMISSION_ORDERS_DELETE,
  PERMISSION_ORDERS_LIST,
  PERMISSION_ORDERS_VIEW
} from "./orders.constants";
import { handlers } from "./orders.mock.handlers";
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
  mockHandlers: handlers,
  permissions: [
    PERMISSION_ORDERS_LIST,
    PERMISSION_ORDERS_VIEW,
    PERMISSION_ORDERS_DELETE
  ]
});

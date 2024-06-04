import { RouteObject } from "react-router-dom";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { MenuItem } from "@/app/app.types";
import { registerModule } from "@/app/modules/modules.helpers";
import { User, UserRoles } from "@/auth/auth.types";
import { AdminLayout } from "@/shared/layouts/AdminLayout";

import locales from "./assets/locales";
import {
  MODULE_ORDERS,
  PERMISSION_ORDERS_DELETE,
  PERMISSION_ORDERS_LIST,
  PERMISSION_ORDERS_VIEW,
} from "./orders.constants";
import { handlers } from "./orders.mock.handlers";
import { OrdersPage } from "./pages/OrdersPage";

const routes: RouteObject[] = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "orders",
        element: <OrdersPage />,
      },
    ],
  },
];

const menuItems: MenuItem[] = [
  {
    title: "orders.title",
    icon: <ShoppingCartIcon />,
    path: "/admin/orders",
    isAllowed: (user: User) => Object.values(UserRoles).some((role) => user.roles.includes(role)),
  },
];

registerModule({
  name: MODULE_ORDERS,
  routes,
  menuItems,
  locales,
  mockHandlers: handlers,
  permissions: [PERMISSION_ORDERS_LIST, PERMISSION_ORDERS_VIEW, PERMISSION_ORDERS_DELETE],
});

import { RouteObject } from "react-router-dom";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { MenuItem } from "@/app/app.types";
import { registerModule } from "@/app/modules/modules.helpers";
import { User, UserRoles } from "@/auth/auth.types";
import { AdminLayout } from "@/shared/layouts/AdminLayout";

import locales from "./assets/locales";
import { MODULE_ORDERS } from "./orders.constants";
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
});
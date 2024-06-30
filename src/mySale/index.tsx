import { RouteObject } from "react-router-dom";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { MenuItem } from "@/app/app.types";
import { registerModule } from "@/app/modules/modules.helpers";
import { User, UserRoles } from "@/auth/auth.types";
import { AdminLayout } from "@/shared/layouts/AdminLayout";

import locales from "./assets/locales";
import { MODULE_MYSALE } from "./mySale.constants";
import { handlers } from "./mySale.mock.handlers";
import { CreatePage } from "./pages/CreatePage";

const routes: RouteObject[] = [
  {
    path: "/mySale",
    element: <AdminLayout />,
    children: [
      {
        path: "create",
        element: <CreatePage />,
      },
    ],
  },
];

const menuItems: MenuItem[] = [
  {
    title: "adasd",
    path: "/mySale/create",
    icon: <ShoppingCartIcon />,
    isAllowed: (user: User) => Object.values(UserRoles).some((role) => user.roles.includes(role)),
    children: [],
  },
];

registerModule({
  name: MODULE_MYSALE,
  routes,
  menuItems,
  locales,
  mockHandlers: handlers,
  permissions: [],
});

import { RouteObject } from "react-router-dom";

import EuroSymbolIcon from "@mui/icons-material/EuroSymbol";

import { MenuItem } from "@/app/app.types";
import { registerModule } from "@/app/modules/modules.helpers";
import { User, UserRoles } from "@/auth/auth.types";
import { AdminLayout } from "@/shared/layouts/AdminLayout";

import locales from "./assets/locales";
import {
  PERMISSION_DEPOSITS_LIST,
  PERMISSION_DEPOSITS_VIEW,
  PERMISSION_DEPOSITS_DELETE,
  MODULE_DEPOSITS,
} from "./deposits.constants";
import { handlers } from "./deposits.mock.handlers";
import { DepositsPage } from "./pages/DepositsPage";

const routes: RouteObject[] = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "deposits",
        element: <DepositsPage />,
      },
    ],
  },
];

const menuItems: MenuItem[] = [
  {
    title: "deposit.title",
    icon: <EuroSymbolIcon />,
    path: "/admin/deposits",
    isAllowed: (user: User) => Object.values(UserRoles).some((role) => user.roles.includes(role)),
  },
];

registerModule({
  name: MODULE_DEPOSITS,
  routes,
  menuItems,
  mockHandlers: handlers,
  locales,
  permissions: [PERMISSION_DEPOSITS_LIST, PERMISSION_DEPOSITS_VIEW, PERMISSION_DEPOSITS_DELETE],
});

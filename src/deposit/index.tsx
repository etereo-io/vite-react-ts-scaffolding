import { RouteObject } from "react-router-dom";

import EuroSymbolIcon from "@mui/icons-material/EuroSymbol";

import { MenuItem } from "@/app/app.types";
import { registerModule } from "@/app/modules/modules.helpers";
import { User, UserRoles } from "@/auth/auth.types";
import { AdminLayout } from "@/shared/layouts/AdminLayout";

import locales from "./assets/locales";
import { MODULE_DEPOSIT } from "./deposit.constants";
import { handlers } from "./deposit.mock.handlers";
import { DepositPage } from "./pages/DepositPage";

const routes: RouteObject[] = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "deposit",
        element: <DepositPage />,
      },
    ],
  },
];

const menuItems: MenuItem[] = [
  {
    title: "deposit.title",
    icon: <EuroSymbolIcon />,
    path: "/admin/deposit",
    isAllowed: (user: User) => Object.values(UserRoles).some((role) => user.roles.includes(role)),
  },
];

registerModule({
  name: MODULE_DEPOSIT,
  routes,
  menuItems,
  mockHandlers: handlers,
  locales,
});

import { BarChart3 } from "lucide-react";
import { Navigate, type RouteObject } from "react-router";

import type { MenuItem } from "@/app/app.types";
import { type User, UserRoles } from "@/app/features/auth/auth.types";
import { registerModule } from "@/app/features/modules/modules.helpers";
import { AdminLayout } from "@/shared/layouts/AdminLayout";

import locales from "./assets/locales";
import { MODULE_DASHBOARD } from "./dashboard.constants";
import { DashboardPage } from "./pages/DashboardPage";

const routes: RouteObject[] = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "",
        element: <Navigate to="dashboard" />
      },
      {
        path: "dashboard",
        element: <DashboardPage />
      }
    ]
  }
];

const menuItems: MenuItem[] = [
  {
    title: "dashboard.dashboard.title",
    icon: <BarChart3 className="w-5 h-5" />,
    path: "/admin/dashboard",
    isAllowed: (user: User) =>
      Object.values(UserRoles).some((role) => user.roles.includes(role))
  }
];

registerModule({
  name: MODULE_DASHBOARD,
  routes,
  menuItems,
  locales
});

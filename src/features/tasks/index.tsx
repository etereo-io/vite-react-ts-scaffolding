import { ClipboardList } from "lucide-react";
import type { RouteObject } from "react-router";

import type { MenuItem } from "@/app/app.types";
import type { User } from "@/app/features/auth/auth.types";
import { registerModule } from "@/app/features/modules/modules.helpers";
import { ProtectedAdminLayout } from "@/shared/layouts/ProtectedAdminLayout";

import { locales } from "./assets/locales";
import {
  MODULE_TASKS,
  PERMISSION_TASKS_ADMIN_ALL,
  PERMISSION_TASKS_READ_ALL,
  PERMISSION_TASKS_WRITE_ALL
} from "./tasks.constants";
import { getMockHandlers } from "./tasks.mock.handlers";
import { TASKS_ROUTES } from "./tasks.routes";

const TasksListPage = async () => {
  const { TasksListPage } = await import("./pages/TasksListPage");
  return { Component: TasksListPage };
};

const TaskFormPage = async () => {
  const { TaskFormPage } = await import("./pages/TaskFormPage");
  return { Component: TaskFormPage };
};

const routes: RouteObject[] = [
  {
    path: "/admin",
    element: <ProtectedAdminLayout />,
    children: [
      {
        path: TASKS_ROUTES.SEGMENTS.list,
        lazy: TasksListPage
      },
      {
        path: TASKS_ROUTES.SEGMENTS.create,
        lazy: TaskFormPage
      },
      {
        path: TASKS_ROUTES.SEGMENTS.edit,
        lazy: TaskFormPage
      }
    ]
  }
];

const menuItems: MenuItem[] = [
  {
    title: "tasks.title",
    path: TASKS_ROUTES.PATTERNS.list,
    icon: <ClipboardList className="w-5 h-5" />,
    isAllowed: (user: User) =>
      user.permissions?.includes(PERMISSION_TASKS_READ_ALL) ||
      user.permissions?.includes(PERMISSION_TASKS_ADMIN_ALL) ||
      true
  }
];

registerModule({
  name: MODULE_TASKS,
  routes,
  menuItems,
  locales,
  getMockHandlers,
  permissions: [
    PERMISSION_TASKS_READ_ALL,
    PERMISSION_TASKS_WRITE_ALL,
    PERMISSION_TASKS_ADMIN_ALL
  ]
});

import { RouteObject } from "react-router-dom";

import { registerModule } from "@/app/modules/modules.helpers";

import locales from "./assets/locales";
import { MODULE_CLIENTS } from "./clients.constants";
import { handlers } from "./clients.mock.handlers";
import { ClientsListPage } from "./pages/ClientsListPage";
import { AdminLayout } from "../shared/layouts/AdminLayout";

const routes: RouteObject[] = [
  {
    path: "/clients",
    element: <AdminLayout />,
    children: [
      {
        path: "",
        element: <ClientsListPage />,
      },
    ],
  },
];

registerModule({
  name: MODULE_CLIENTS,
  routes,
  locales,
  mockHandlers: handlers,
});

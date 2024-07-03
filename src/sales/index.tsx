import { RouteObject } from "react-router-dom";

import { registerModule } from "@/app/modules/modules.helpers";
import { AdminLayout } from "@/shared/layouts/AdminLayout";

import locales from "./assets/locales";
import { NewSalePage } from "./pages/NewSalePage";
import { SalesPage } from "./pages/SalesPage";
import { MODULE_SALES } from "./sales.constants";
import { handlers } from "./sales.mock.handlers";

const routes: RouteObject[] = [
  {
    path: "/sales",
    element: <AdminLayout />,
    children: [
      {
        path: "",
        element: <SalesPage />,
      },
      {
        path: "new",
        element: <NewSalePage />,
      },
    ],
  },
];

registerModule({
  name: MODULE_SALES,
  routes,
  locales,
  mockHandlers: handlers,
  permissions: [],
});

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { getAllRoutes } from "../modules/modules.helpers";

const basename = import.meta.env.APP_CONTEXT_PATH;

const router = createBrowserRouter(getAllRoutes(), { basename });

export function AppRoutes() {
  return <RouterProvider router={router} />;
}

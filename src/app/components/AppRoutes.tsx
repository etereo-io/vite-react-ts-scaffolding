import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { routes } from "../routes";

const basename = import.meta.env.APP_CONTEXT_PATH;

const router = createBrowserRouter(routes, { basename });

export function AppRoutes() {
  return <RouterProvider router={router} />;
}

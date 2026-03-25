import { Navigate, type RouteObject } from "react-router";

import { registerModule } from "@/app/features/modules/modules.helpers";
import { Error404 } from "@/shared/components/Error404";

import { MODULE_AUTH } from "./auth.constants";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/login" />
  },
  {
    path: "/login",
    async lazy() {
      const { SignInPage } = await import("./pages/SignInPage");
      return { Component: SignInPage };
    }
  },
  {
    path: "*",
    element: <Error404 />
  }
];

registerModule({
  name: MODULE_AUTH,
  routes,
  getMockHandlers: () =>
    import("./auth.mock.handlers").then((m) => m.getMockHandlers())
});

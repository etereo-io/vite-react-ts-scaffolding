import { Navigate, type RouteObject } from "react-router";

import { registerModule } from "@/app/features/modules/modules.helpers";
import { Error404 } from "@/shared/components/Error404";

import { MODULE_AUTH } from "./auth.constants";
import { getMockHandlers } from "./auth.mock.handlers";
import { SignInPage } from "./pages/SignInPage";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/login" />
  },
  {
    path: "/login",
    element: <SignInPage />
  },
  {
    path: "*",
    element: <Error404 />
  }
];

registerModule({
  name: MODULE_AUTH,
  routes,
  getMockHandlers
});

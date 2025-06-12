import { Navigate, RouteObject } from "react-router";

import { registerModule } from "@/app/features/modules/modules.helpers";

import { MODULE_AUTH } from "./auth.constants";
import { SignInPage } from "./pages/SignInPage";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/login" />
  },
  {
    path: "/login",
    element: <SignInPage />
  }
];

registerModule({
  name: MODULE_AUTH,
  routes
});

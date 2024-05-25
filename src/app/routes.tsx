import { Navigate } from "react-router-dom";

import { Dashboard } from "@/admin-commons/pages/Dashboard";
import { SignInSide } from "@/auth/pages/SignInSide";

export const routes = [
  {
    path: "/admin/login",
    element: <SignInSide />,
  },
  {
    path: "/admin/dashboard",
    element: <Dashboard />,
  },
  {
    path: "*",
    element: <Navigate to="/admin/login" />,
  },
];

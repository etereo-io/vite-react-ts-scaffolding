import { Navigate, useLocation } from "react-router";

import { Error403 } from "@/shared/components/Error403";

import { AUTH_LOGIN_PATH } from "../auth.constants";
import {
  evaluateAuthorizationRule,
  setRedirectAfterLogin
} from "../auth.helpers";
import type { AuthorizationRule } from "../auth.types";
import { useAuth } from "../providers/AuthContext";

interface ProtectedRouteProps {
  readonly children: React.ReactNode;
  readonly authorization?: AuthorizationRule;
  readonly loginPath?: string;
  readonly forbiddenComponent?: React.ReactNode;
  readonly loadingComponent?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  authorization,
  loginPath = AUTH_LOGIN_PATH,
  forbiddenComponent,
  loadingComponent
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isPending } = useAuth();
  const location = useLocation();

  if (isPending) {
    return loadingComponent ?? null;
  }

  if (!isAuthenticated || !user) {
    setRedirectAfterLogin(location.pathname + location.search);
    return <Navigate to={loginPath} replace />;
  }

  if (authorization) {
    const isAuthorized = evaluateAuthorizationRule({
      user,
      rule: authorization
    });

    if (!isAuthorized) {
      return forbiddenComponent ?? <Error403 />;
    }
  }

  return children;
}

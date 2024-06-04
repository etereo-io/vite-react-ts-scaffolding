import { useCallback } from "react";

import { useLoggedUser } from "./useLoggedUser";
import { isUserAllowed } from "../auth.helpers";
import { RequiredPermissions } from "../auth.types";

export function useUserAuth() {
  const { user, isPending } = useLoggedUser();

  const isAllowed = useCallback((permissions: RequiredPermissions) => isUserAllowed({ user, permissions }), [user]);

  return {
    isAllowed,
    isPending,
  };
}

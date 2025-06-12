import { useCallback } from "react";

import { isUserAllowed } from "../auth.helpers";
import { RequiredPermissions } from "../auth.types";
import { useLoggedUser } from "./useLoggedUser";

export function useUserAuth() {
  const { user, isPending } = useLoggedUser();

  const isAllowed = useCallback(
    (permissions: RequiredPermissions) => isUserAllowed({ user, permissions }),
    [user]
  );

  return {
    isAllowed,
    isPending
  };
}

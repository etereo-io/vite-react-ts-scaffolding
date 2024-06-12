import { useUserAuth } from "@/auth/hooks/useUserAuth";

import { PERMISSION_DEPOSITS_DELETE, PERMISSION_DEPOSITS_LIST, PERMISSION_DEPOSITS_VIEW } from "../deposits.constants";
export function useDepositPermissions() {
  const { isAllowed, isPending } = useUserAuth();

  const canList = isAllowed(PERMISSION_DEPOSITS_LIST);
  const canView = isAllowed(PERMISSION_DEPOSITS_VIEW);
  const canDelete = isAllowed(PERMISSION_DEPOSITS_DELETE);

  return {
    isPending,
    canList,
    canView,
    canDelete,
  };
}

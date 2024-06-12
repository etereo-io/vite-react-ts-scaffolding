import { useUserAuth } from "@/auth/hooks/useUserAuth";

import { PERMISSION_DEPOSIT_DELETE, PERMISSION_DEPOSIT_LIST, PERMISSION_DEPOSIT_VIEW } from "../deposit.constants";

export function useDepositPermissions() {
  const { isAllowed, isPending } = useUserAuth();

  const canList = isAllowed(PERMISSION_DEPOSIT_LIST);
  const canView = isAllowed(PERMISSION_DEPOSIT_VIEW);
  const canDelete = isAllowed(PERMISSION_DEPOSIT_DELETE);

  return {
    isPending,
    canList,
    canView,
    canDelete,
  };
}

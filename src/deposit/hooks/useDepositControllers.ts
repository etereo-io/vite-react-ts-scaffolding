import { useCallback, useMemo } from "react";

import { useDeposit } from "./useDeposit";
import { useDepositDelete } from "./useDepositDelete";
import { useDepositPermissions } from "./useDepositPermissions";

export function useDepositControllers() {
  const { data: deposits } = useDeposit();
  const { canDelete } = useDepositPermissions();

  const totalAmount = useMemo(() => {
    if (!deposits) return 0;
    return deposits.data.reduce((total, deposit) => total + parseFloat(deposit.amount), 0);
  }, [deposits]);

  const mutation = useDepositDelete();

  const handleDepositDelete = useCallback((depositId: string) => () => mutation.mutate(depositId), [mutation]);

  return {
    deposits,
    canDelete,
    totalAmount,
    mutation,
    handleDepositDelete,
  };
}

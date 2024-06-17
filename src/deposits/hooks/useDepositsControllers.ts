import { useCallback, useMemo } from "react";

import { useDepositDelete } from "./useDepositDelete";
import { useDeposits } from "./useDeposits";
import { useDepositPermissions } from "./useDepositsPermissions";

export function useDepositsControllers() {
  const { data: deposits, isPending } = useDeposits();
  const { canDelete } = useDepositPermissions();

  const totalAmount = useMemo(() => {
    if (!deposits) return 0;
    return deposits.data.reduce((total, deposit) => total + parseFloat(deposit.amount), 0);
  }, [deposits]);

  const mutation = useDepositDelete();

  const handleDepositDelete = useCallback((depositId: string) => () => mutation.mutate(depositId), [mutation]);

  return {
    deposits,
    isPending,
    canDelete,
    totalAmount,
    mutation,
    handleDepositDelete,
  };
}

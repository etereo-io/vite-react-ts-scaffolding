import { useCallback, useMemo } from "react";

import { useDeposit } from "./useDeposit";
import { useDepositDelete } from "./useDepositDelete";

export function useDepositControllers() {
  const { data: deposits } = useDeposit();

  const totalAmount = useMemo(() => {
    if (!deposits) return 0;
    return deposits.data.reduce((total, deposit) => total + parseFloat(deposit.amount), 0);
  }, [deposits]);

  const mutation = useDepositDelete();

  const handleDepositDelete = useCallback((depositId: string) => () => mutation.mutate(depositId), [mutation]);

  return {
    deposits,
    totalAmount,
    mutation,
    handleDepositDelete,
  };
}

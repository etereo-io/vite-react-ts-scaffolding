import { useCallback } from "react";

import { useDeposit } from "./useDeposit";
import { useDepositDelete } from "./useDepositDelete";

export function useDepositControllers() {
  const { data: deposits } = useDeposit();

  const totalAmount = deposits
    ? deposits.data.reduce((total, deposit) => total + parseFloat(deposit.amount), 0).toFixed(2)
    : 0;

  const mutation = useDepositDelete();

  const handleDepositDelete = useCallback((depositId: string) => () => mutation.mutate(depositId), [mutation]);

  return {
    deposits,
    totalAmount,
    handleDepositDelete,
  };
}

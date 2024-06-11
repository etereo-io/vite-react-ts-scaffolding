import { useDeposit } from "./useDeposit";

export function useDepositControllers() {
  const { data: deposits } = useDeposit();
  const totalAmount = deposits
    ? deposits.data.reduce((total, deposit) => total + parseFloat(deposit.amount), 0).toFixed(2)
    : 0;

  return {
    deposits,
    totalAmount,
  };
}

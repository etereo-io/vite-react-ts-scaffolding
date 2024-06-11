import { useMutation, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEY_DEPOSIT } from "../deposit.constants";
import { deleteDeposit } from "../deposit.services";

export function useDepositDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => {
      return deleteDeposit(orderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_DEPOSIT],
      });
    },
  });
}

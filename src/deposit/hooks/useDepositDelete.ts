import { useTranslation } from "react-i18next";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEY_DEPOSIT } from "../deposit.constants";
import { deleteDeposit } from "../deposit.services";

export function useDepositDelete() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (depositId: string) => {
      return deleteDeposit(depositId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_DEPOSIT],
      });
    },
    meta: {
      errorMessage: t("deposit.delete.error"),
      successMessage: t("deposit.delete.success"),
    },
  });
}

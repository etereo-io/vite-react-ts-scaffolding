import { useTranslation } from "react-i18next";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEY_DEPOSITS } from "../deposits.constants";
import { deleteDeposit } from "../deposits.services";

export function useDepositDelete() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (depositId: string) => {
      return deleteDeposit(depositId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_DEPOSITS],
      });
    },
    meta: {
      errorMessage: t("deposit.delete.error"),
      successMessage: t("deposit.delete.success"),
    },
  });
}

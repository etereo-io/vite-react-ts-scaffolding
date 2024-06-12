import { useTranslation } from "react-i18next";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEY_DEPOSIT } from "../deposit.constants";
import { fetchDeposits } from "../deposit.services";

export function useDeposit() {
  const { t } = useTranslation();
  return useQuery({
    queryKey: [QUERY_KEY_DEPOSIT],
    queryFn: () => fetchDeposits(),
    meta: {
      errorMessage: t("deposit.fetch.error"),
    },
  });
}

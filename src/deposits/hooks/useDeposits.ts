import { useTranslation } from "react-i18next";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEY_DEPOSITS } from "../deposits.constants";
import { fetchDeposits } from "../deposits.services";

export function useDeposits() {
  const { t } = useTranslation();
  return useQuery({
    queryKey: [QUERY_KEY_DEPOSITS],
    queryFn: () => fetchDeposits(),
    meta: {
      errorMessage: t("deposit.fetch.error"),
    },
  });
}

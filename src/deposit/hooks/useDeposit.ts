import { useQuery } from "@tanstack/react-query";

import { QUERY_KEY_DEPOSIT } from "../deposit.constants";
import { fetchDeposits } from "../deposit.services";

export function useDeposit() {
  return useQuery({
    queryKey: [QUERY_KEY_DEPOSIT],
    queryFn: () => fetchDeposits(),

    // // TODO
    // // ensure query has error handling
    // meta: {
    //   errorMessage: "deposits.fetch.error",
    // },
  });
}

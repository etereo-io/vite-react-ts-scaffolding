import { useTranslation } from "react-i18next";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useMetrics } from "@/lib/metrics/useMetrics";

import { EVENT_ORDER_DELETE, QUERY_KEY_ORDERS } from "../orders.constants";
import { deleteOrder } from "../orders.services";

export function useOrderDelete() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const metrics = useMetrics();

  return useMutation({
    mutationFn: (orderId: string) => {
      // event from mutation actions could be defined in hooks
      metrics.event(EVENT_ORDER_DELETE);
      return deleteOrder(orderId);
    },
    onSuccess: () => {
      // ensure refetch orders after delete
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_ORDERS],
      });
    },
    // ensure mutation has error/success handling
    meta: {
      errorMessage: t("orders.delete.error"),
      successMessage: t("orders.delete.success"),
    },
  });
}

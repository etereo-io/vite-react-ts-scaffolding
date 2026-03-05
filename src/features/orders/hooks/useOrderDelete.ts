import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { useMetrics } from "@/lib/metrics/useMetrics";

import { EVENT_ORDER_DELETE, orderKeys } from "../orders.constants";
import { ordersService } from "../orders.services";

export function useOrderDelete() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const metrics = useMetrics();

  return useMutation({
    mutationFn: (orderId: string) => {
      // event from mutation actions could be defined in hooks
      metrics.event(EVENT_ORDER_DELETE);
      return ordersService.deleteOrder(orderId);
    },
    onSuccess: () => {
      // ensure refetch orders after delete
      queryClient.invalidateQueries({
        queryKey: orderKeys.all
      });
    },
    // ensure mutation has error/success handling
    meta: {
      errorMessage: t("orders.delete.error"),
      successMessage: t("orders.delete.success")
    }
  });
}

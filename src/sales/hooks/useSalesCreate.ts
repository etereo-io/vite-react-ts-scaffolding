import { useMutation } from "@tanstack/react-query";

import { useMetrics } from "@/lib/metrics/useMetrics";

import { NewSaleFormValues } from "../components/forms/NewSaleForm/types";
import { createSale } from "../sales.service";
import { EVENT_SALE_CREATE } from "../sales.types";

export function useSalesCreate() {
  const metrics = useMetrics();

  return useMutation({
    mutationFn: (sale: NewSaleFormValues) => {
      metrics.event(EVENT_SALE_CREATE);
      return createSale(sale);
    },
  });
}

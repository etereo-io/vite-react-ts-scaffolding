import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { useMetrics } from "@/lib/metrics/useMetrics";

import { EVENT_TASK_DELETED, taskKeys } from "../tasks.constants";
import { tasksService } from "../tasks.services";

export function useDeleteTask() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const metrics = useMetrics();

  return useMutation({
    mutationFn: (id: string) => {
      metrics.event(EVENT_TASK_DELETED);
      return tasksService.deleteTask(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.lists()
      });
    },
    meta: {
      errorMessage: t("tasks.delete.error"),
      successMessage: t("tasks.delete.success")
    }
  });
}

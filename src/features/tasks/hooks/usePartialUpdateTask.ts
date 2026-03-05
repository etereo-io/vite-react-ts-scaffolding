import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { useMetrics } from "@/lib/metrics/useMetrics";

import { EVENT_TASK_UPDATED, taskKeys } from "../tasks.constants";
import { tasksService } from "../tasks.services";
import type { TaskUpdateRequest } from "../tasks.types";

interface PartialUpdateTaskVariables {
  id: string;
  data: TaskUpdateRequest;
}

export function usePartialUpdateTask() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const metrics = useMetrics();

  return useMutation({
    mutationFn: ({ id, data }: PartialUpdateTaskVariables) => {
      metrics.event(EVENT_TASK_UPDATED);
      return tasksService.partialUpdateTask(id, data);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(variables.id)
      });
      queryClient.invalidateQueries({
        queryKey: taskKeys.lists()
      });
    },
    meta: {
      errorMessage: t("tasks.update.error"),
      successMessage: t("tasks.update.success")
    }
  });
}

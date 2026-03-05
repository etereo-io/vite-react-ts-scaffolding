import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { useMetrics } from "@/lib/metrics/useMetrics";

import { EVENT_TASK_UPDATED, taskKeys } from "../tasks.constants";
import { tasksService } from "../tasks.services";
import type { TaskCreateRequest } from "../tasks.types";

interface UpdateTaskVariables {
  id: string;
  data: TaskCreateRequest;
}

export function useUpdateTask() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const metrics = useMetrics();

  return useMutation({
    mutationFn: ({ id, data }: UpdateTaskVariables) => {
      metrics.event(EVENT_TASK_UPDATED);
      return tasksService.updateTask(id, data);
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

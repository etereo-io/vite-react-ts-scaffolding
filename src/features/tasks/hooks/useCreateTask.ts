import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { useMetrics } from "@/lib/metrics/useMetrics";

import { EVENT_TASK_CREATED, taskKeys } from "../tasks.constants";
import { tasksService } from "../tasks.services";
import type { TaskCreateRequest } from "../tasks.types";

export function useCreateTask() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const metrics = useMetrics();

  return useMutation({
    mutationFn: (data: TaskCreateRequest) => {
      metrics.event(EVENT_TASK_CREATED);
      return tasksService.createTask(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.lists()
      });
    },
    meta: {
      errorMessage: t("tasks.create.error"),
      successMessage: t("tasks.create.success")
    }
  });
}

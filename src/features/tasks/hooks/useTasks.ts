import { useQuery } from "@tanstack/react-query";

import { DEFAULT_TASKS_FILTERS, taskKeys } from "../tasks.constants";
import { tasksService } from "../tasks.services";
import type { TaskFilters } from "../tasks.types";

export function useTasks(filters: TaskFilters = DEFAULT_TASKS_FILTERS) {
  return useQuery({
    queryKey: taskKeys.list(filters as Record<string, unknown>),
    queryFn: () => tasksService.listTasks(filters),
    meta: {
      errorMessage: "tasks.fetch.error"
    }
  });
}

import { useQuery } from "@tanstack/react-query";

import { taskKeys } from "../tasks.constants";
import { tasksService } from "../tasks.services";

export function useTask(id: string) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => tasksService.getTaskById(id),
    enabled: !!id,
    meta: {
      errorMessage: "tasks.fetchDetail.error"
    }
  });
}

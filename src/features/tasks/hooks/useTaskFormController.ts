import { useCallback } from "react";

import { TaskPriority, TaskStatus } from "../tasks.enums";
import type { TaskFormData } from "../tasks.schemas";
import type { TaskResponse } from "../tasks.types";
import { useCreateTask } from "./useCreateTask";
import { useUpdateTask } from "./useUpdateTask";

interface UseTaskFormControllerOptions {
  readonly mode: "create" | "edit";
  readonly task?: TaskResponse;
  readonly onSuccess?: () => void;
}

export function useTaskFormController(options: UseTaskFormControllerOptions) {
  const { mode, task, onSuccess } = options;

  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const defaultValues: TaskFormData = {
    title: task?.title ?? "",
    description: task?.description ?? "",
    status: task?.status ?? TaskStatus.PENDING,
    priority: task?.priority ?? TaskPriority.MEDIUM,
    assignee: task?.assignee ?? "",
    dueDate: task?.dueDate ?? ""
  };

  const handleSubmit = useCallback(
    (data: TaskFormData) => {
      const payload = {
        ...data,
        assignee: data.assignee || undefined,
        dueDate: data.dueDate || undefined,
        description: data.description || undefined
      };

      if (mode === "create") {
        createMutation.mutate(payload, {
          onSuccess: () => onSuccess?.()
        });
      } else if (task) {
        updateMutation.mutate(
          { id: task.id, data: payload },
          {
            onSuccess: () => onSuccess?.()
          }
        );
      }
    },
    [mode, task, createMutation, updateMutation, onSuccess]
  );

  return {
    defaultValues,
    isSubmitting,
    isCreateMode: mode === "create",
    isEditMode: mode === "edit",
    handleSubmit,
    createError: createMutation.error,
    updateError: updateMutation.error
  };
}

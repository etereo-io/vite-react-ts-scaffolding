import { useCallback, useMemo } from "react";

import { DEFAULT_TASKS_FILTERS, DEFAULT_TASKS_SORT } from "../tasks.constants";
import {
  buildTaskSortQuery,
  mapColumnFiltersToTaskFilters
} from "../tasks.helpers";
import type { TaskFilters } from "../tasks.types";
import { useDeleteTask } from "./useDeleteTask";
import { useTasks } from "./useTasks";
import { useTasksPermissions } from "./useTasksPermissions";

interface SortingState {
  readonly id: string;
  readonly desc: boolean;
}

interface ColumnFilter {
  readonly id: string;
  readonly value: unknown;
}

interface PaginationState {
  readonly pageIndex: number;
  readonly pageSize: number;
}

interface UseTasksListControllerOptions {
  readonly columnFilters?: ColumnFilter[];
  readonly globalFilter?: string;
  readonly sorting?: SortingState[];
  readonly pagination?: PaginationState;
}

export function useTasksListController(
  options: UseTasksListControllerOptions = {}
) {
  const {
    columnFilters = [],
    globalFilter = "",
    sorting = [],
    pagination = { pageIndex: 0, pageSize: DEFAULT_TASKS_FILTERS.limit }
  } = options;

  const permissions = useTasksPermissions();
  const deleteTaskMutation = useDeleteTask();

  const filters: TaskFilters = useMemo(() => {
    const mappedFilters = mapColumnFiltersToTaskFilters(
      columnFilters,
      globalFilter
    );
    const sortQuery = buildTaskSortQuery(sorting);

    return {
      ...mappedFilters,
      offset: pagination.pageIndex * pagination.pageSize,
      limit: pagination.pageSize,
      sort: sortQuery || DEFAULT_TASKS_SORT
    };
  }, [columnFilters, globalFilter, sorting, pagination]);

  const { data, isFetching, isError, error } = useTasks(filters);

  const handleDeleteTask = useCallback(
    (taskId: string) => () => deleteTaskMutation.mutate(taskId),
    [deleteTaskMutation]
  );

  const totalPages = useMemo(() => {
    if (!data?.total) {
      return 0;
    }
    return Math.ceil(data.total / pagination.pageSize);
  }, [data?.total, pagination.pageSize]);

  return {
    // Data
    tasks: data?.data ?? [],
    total: data?.total ?? 0,
    totalPages,

    // State
    isFetching,
    isError,
    error,
    isDeleting: deleteTaskMutation.isPending,

    // Permissions
    ...permissions,

    // Handlers
    handleDeleteTask
  };
}

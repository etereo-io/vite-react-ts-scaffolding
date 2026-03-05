import { useUserAuth } from "@/app/features/auth/hooks/useUserAuth";

import {
  PERMISSION_TASKS_ADMIN_ALL,
  PERMISSION_TASKS_READ_ALL,
  PERMISSION_TASKS_WRITE_ALL
} from "../tasks.constants";

export function useTasksPermissions() {
  const { isAllowed, isPending } = useUserAuth();

  const canRead = isAllowed(PERMISSION_TASKS_READ_ALL);
  const canWrite = isAllowed(PERMISSION_TASKS_WRITE_ALL);
  const canAdmin = isAllowed(PERMISSION_TASKS_ADMIN_ALL);

  const canCreate = canWrite || canAdmin;
  const canUpdate = canWrite || canAdmin;
  const canDelete = canAdmin;

  return {
    isPending,
    canRead,
    canWrite,
    canAdmin,
    canCreate,
    canUpdate,
    canDelete
  };
}

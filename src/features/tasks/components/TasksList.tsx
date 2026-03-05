import { Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import type { RequiredPermissions } from "@/app/features/auth/auth.types";
import { AllowedAuth } from "@/app/features/auth/components/AllowedAuth";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/shared/components/ui/table";

import { TASKS_ROUTES } from "../tasks.routes";
import type { TaskResponse } from "../tasks.types";
import { TaskPriorityBadge } from "./TaskPriorityBadge";
import { TaskStatusBadge } from "./TaskStatusBadge";

interface TasksListProps {
  readonly tasks: TaskResponse[];
  readonly canDelete: RequiredPermissions;
  readonly onDelete: (id: string) => void;
}

export function TasksList({ tasks, canDelete, onDelete }: TasksListProps) {
  const { t } = useTranslation();

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t("tasks.table.empty")}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("tasks.table.columns.title")}</TableHead>
          <TableHead>{t("tasks.table.columns.status")}</TableHead>
          <TableHead>{t("tasks.table.columns.priority")}</TableHead>
          <TableHead>{t("tasks.table.columns.assignee")}</TableHead>
          <TableHead>{t("tasks.table.columns.dueDate")}</TableHead>
          <TableHead className="text-right">
            {t("tasks.table.columns.actions")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell className="font-medium">{task.title}</TableCell>
            <TableCell>
              <TaskStatusBadge status={task.status} />
            </TableCell>
            <TableCell>
              <TaskPriorityBadge priority={task.priority} />
            </TableCell>
            <TableCell>{task.assignee ?? "-"}</TableCell>
            <TableCell>
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon-xs" asChild>
                  <Link to={TASKS_ROUTES.PATTERNS.edit(task.id)}>
                    <Pencil className="w-4 h-4" />
                  </Link>
                </Button>
                <AllowedAuth permissions={canDelete}>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => onDelete(task.id)}
                    aria-label={t("tasks.actions.delete")}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </AllowedAuth>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

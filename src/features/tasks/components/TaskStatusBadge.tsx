import { useTranslation } from "react-i18next";

import { Badge } from "@/shared/components/ui/badge";

import type { TaskStatus } from "../tasks.enums";
import { getStatusBadgeVariant } from "../tasks.helpers";

interface TaskStatusBadgeProps {
  readonly status: TaskStatus;
}

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  const { t } = useTranslation();
  const variant = getStatusBadgeVariant(status);

  return <Badge variant={variant}>{t(`tasks.status.${status}`)}</Badge>;
}

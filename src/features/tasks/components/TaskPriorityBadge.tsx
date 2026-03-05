import { useTranslation } from "react-i18next";

import { Badge } from "@/shared/components/ui/badge";

import type { TaskPriority } from "../tasks.enums";
import { getPriorityBadgeVariant } from "../tasks.helpers";

interface TaskPriorityBadgeProps {
  readonly priority: TaskPriority;
}

export function TaskPriorityBadge({ priority }: TaskPriorityBadgeProps) {
  const { t } = useTranslation();
  const variant = getPriorityBadgeVariant(priority);

  return <Badge variant={variant}>{t(`tasks.priority.${priority}`)}</Badge>;
}

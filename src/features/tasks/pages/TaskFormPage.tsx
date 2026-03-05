import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router";

import { Title } from "@/shared/components/Title";
import { Button } from "@/shared/components/ui/button";

import { TaskForm } from "../components/TaskForm";
import { useTask } from "../hooks/useTask";
import { useTaskFormController } from "../hooks/useTaskFormController";
import { TASKS_ROUTES } from "../tasks.routes";

export function TaskFormPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();

  const isEditMode = !!taskId;
  const { data: task } = useTask(taskId ?? "");

  const { defaultValues, isSubmitting, handleSubmit } = useTaskFormController({
    mode: isEditMode ? "edit" : "create",
    task: task ?? undefined,
    onSuccess: () => navigate(TASKS_ROUTES.PATTERNS.list)
  });

  return (
    <div className="col-span-1 md:col-span-3">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to={TASKS_ROUTES.PATTERNS.list}>
              <ArrowLeft className="w-4 h-4" />
              {t("tasks.actions.back")}
            </Link>
          </Button>
        </div>

        <Title>
          {isEditMode
            ? t("tasks.page.edit.title")
            : t("tasks.page.create.title")}
        </Title>

        <TaskForm
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}

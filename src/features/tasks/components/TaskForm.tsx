import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";

import { TaskPriority, TaskStatus } from "../tasks.enums";
import { type TaskFormData, taskFormSchema } from "../tasks.schemas";

interface TaskFormProps {
  readonly onSubmit: (values: TaskFormData) => void;
  readonly defaultValues?: Partial<TaskFormData>;
  readonly isSubmitting?: boolean;
}

export function TaskForm({
  onSubmit,
  defaultValues,
  isSubmitting = false
}: TaskFormProps) {
  const { t } = useTranslation();
  const isEditMode = !!defaultValues?.title;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      status: TaskStatus.PENDING,
      priority: TaskPriority.MEDIUM,
      assignee: "",
      dueDate: "",
      ...defaultValues
    }
  });

  const statusValue = watch("status");
  const priorityValue = watch("priority");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">{t("tasks.form.fields.title")}</Label>
        <Input
          id="title"
          placeholder={t("tasks.form.placeholders.title")}
          {...register("title")}
          aria-invalid={!!errors.title}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          {t("tasks.form.fields.description")}
        </Label>
        <Textarea
          id="description"
          placeholder={t("tasks.form.placeholders.description")}
          {...register("description")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t("tasks.form.fields.status")}</Label>
          <Select
            value={statusValue}
            onValueChange={(value) => setValue("status", value as TaskStatus)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(TaskStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {t(`tasks.status.${status}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("tasks.form.fields.priority")}</Label>
          <Select
            value={priorityValue}
            onValueChange={(value) =>
              setValue("priority", value as TaskPriority)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(TaskPriority).map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {t(`tasks.priority.${priority}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="assignee">{t("tasks.form.fields.assignee")}</Label>
          <Input
            id="assignee"
            placeholder={t("tasks.form.placeholders.assignee")}
            {...register("assignee")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">{t("tasks.form.fields.dueDate")}</Label>
          <Input id="dueDate" type="date" {...register("dueDate")} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isEditMode
            ? t("tasks.form.submit.update")
            : t("tasks.form.submit.create")}
        </Button>
      </div>
    </form>
  );
}

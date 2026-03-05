import { z } from "zod/v4";

import { TaskPriority, TaskStatus } from "./tasks.enums";

export const taskFormSchema = z.object({
  title: z
    .string()
    .min(1, "tasks.validation.titleRequired")
    .max(200, "tasks.validation.titleMaxLength"),
  description: z
    .string()
    .max(2000, "tasks.validation.descriptionMaxLength")
    .optional()
    .or(z.literal("")),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority),
  assignee: z.string().optional().or(z.literal("")),
  dueDate: z.string().optional().or(z.literal(""))
});

export type TaskFormData = z.infer<typeof taskFormSchema>;

export const taskFiltersSchema = z.object({
  "status.eq": z.nativeEnum(TaskStatus).optional(),
  "status.in": z.array(z.nativeEnum(TaskStatus)).optional(),
  "priority.eq": z.nativeEnum(TaskPriority).optional(),
  "assignee.eq": z.string().optional(),
  "dueDate.lte": z.string().optional(),
  "dueDate.gte": z.string().optional(),
  search: z.string().optional(),
  offset: z.number().int().min(0).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  sort: z.string().optional()
});

export type TaskFiltersData = z.infer<typeof taskFiltersSchema>;

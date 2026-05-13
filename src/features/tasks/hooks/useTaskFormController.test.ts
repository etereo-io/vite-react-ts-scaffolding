import { act, renderHook, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, test, vi } from "vitest";
import { setupMockServer } from "#/msw";
import { TestProviders } from "#/tests.helpers";
import { API_MOCK_PREFIX } from "@/app/features/api/api.constants";
import { server } from "@/app/features/mock-server/node";
import { taskMother } from "../__mocks__/task.mother";
import { TaskPriority, TaskStatus } from "../tasks.enums";
import type { TaskResponse } from "../tasks.types";
import { useTaskFormController } from "./useTaskFormController";

const mockEvent = vi.fn();
vi.mock("@/lib/metrics/useMetrics", () => ({
  useMetrics: () => ({
    event: mockEvent
  })
}));

const mockInvalidateQueries = vi.fn();
vi.mock("@tanstack/react-query", async () => ({
  ...(await vi.importActual("@tanstack/react-query")),
  useQueryClient: () => ({
    invalidateQueries: () => mockInvalidateQueries()
  })
}));

setupMockServer();

describe("useTaskFormController", () => {
  const existingTask: TaskResponse = taskMother.getRandomTask({
    id: "task-edit-1",
    title: "Existing task",
    description: "Existing description",
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    assignee: "John Doe",
    dueDate: "2026-06-01T00:00:00.000Z"
  });

  describe("create mode", () => {
    test("should return default values for create", () => {
      const { result } = renderHook(
        () => useTaskFormController({ mode: "create" }),
        { wrapper: TestProviders }
      );

      expect(result.current.isCreateMode).toBe(true);
      expect(result.current.isEditMode).toBe(false);
      expect(result.current.defaultValues.title).toBe("");
      expect(result.current.defaultValues.status).toBe(TaskStatus.PENDING);
      expect(result.current.defaultValues.priority).toBe(TaskPriority.MEDIUM);
    });

    test("should submit create mutation", async () => {
      const createdTask = taskMother.getRandomTask();

      server.use(
        http.post(`${API_MOCK_PREFIX}/api/v1/tasks`, () =>
          HttpResponse.json(createdTask, { status: 201 })
        )
      );

      const onSuccess = vi.fn();
      const { result } = renderHook(
        () => useTaskFormController({ mode: "create", onSuccess }),
        { wrapper: TestProviders }
      );

      act(() => {
        result.current.handleSubmit({
          title: "New task",
          status: TaskStatus.PENDING,
          priority: TaskPriority.MEDIUM
        });
      });

      await waitFor(() => expect(result.current.isSubmitting).toBe(false));
      await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
    });
  });

  describe("edit mode", () => {
    test("should populate default values from existing task", () => {
      const { result } = renderHook(
        () => useTaskFormController({ mode: "edit", task: existingTask }),
        { wrapper: TestProviders }
      );

      expect(result.current.isEditMode).toBe(true);
      expect(result.current.isCreateMode).toBe(false);
      expect(result.current.defaultValues.title).toBe(existingTask.title);
      expect(result.current.defaultValues.status).toBe(existingTask.status);
      expect(result.current.defaultValues.priority).toBe(existingTask.priority);
      expect(result.current.defaultValues.assignee).toBe(existingTask.assignee);
    });

    test("should submit update mutation", async () => {
      const updatedTask = { ...existingTask, title: "Updated" };

      server.use(
        http.put(`${API_MOCK_PREFIX}/api/v1/tasks/${existingTask.id}`, () =>
          HttpResponse.json(updatedTask)
        )
      );

      const onSuccess = vi.fn();
      const { result } = renderHook(
        () =>
          useTaskFormController({
            mode: "edit",
            task: existingTask,
            onSuccess
          }),
        { wrapper: TestProviders }
      );

      act(() => {
        result.current.handleSubmit({
          title: "Updated",
          status: TaskStatus.IN_PROGRESS,
          priority: TaskPriority.HIGH
        });
      });

      await waitFor(() => expect(result.current.isSubmitting).toBe(false));
      await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
    });

    test("should not submit update if no task provided", () => {
      const { result } = renderHook(
        () => useTaskFormController({ mode: "edit" }),
        { wrapper: TestProviders }
      );

      act(() => {
        result.current.handleSubmit({
          title: "Orphan",
          status: TaskStatus.PENDING,
          priority: TaskPriority.LOW
        });
      });

      // No mutation should fire — nothing to assert except no crash
      expect(result.current.isSubmitting).toBe(false);
    });
  });
});

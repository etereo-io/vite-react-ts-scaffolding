import { screen } from "@testing-library/react";
import type { Mock } from "vitest";
import { renderWithTestProviders } from "#/tests.helpers";
import { userMother } from "@/app/features/auth/__mocks__/user.mother";
import { useLoggedUser } from "@/app/features/auth/hooks/useLoggedUser";
import { taskMother } from "../__mocks__/task.mother";
import { TaskPriority, TaskStatus } from "../tasks.enums";
import { TasksList } from "./TasksList";

vi.mock("@/app/features/auth/hooks/useLoggedUser");

// Deterministic data for snapshot stability
const fixedTasks = [
  taskMother.getRandomTask({
    id: "task-1",
    title: "Fix login bug",
    status: TaskStatus.PENDING,
    priority: TaskPriority.HIGH,
    assignee: "Alice",
    dueDate: "2026-04-01T00:00:00.000Z",
    createdAt: "2026-03-01T00:00:00.000Z",
    updatedAt: "2026-03-01T00:00:00.000Z"
  }),
  taskMother.getRandomTask({
    id: "task-2",
    title: "Write tests",
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.MEDIUM,
    assignee: null,
    dueDate: null,
    createdAt: "2026-03-02T00:00:00.000Z",
    updatedAt: "2026-03-02T00:00:00.000Z"
  })
];

describe("TasksList", () => {
  const tasks = taskMother.getRandomList(3);

  beforeEach(() => {
    (useLoggedUser as Mock).mockReturnValue({
      user: userMother.getMockUser()
    });
  });

  it("should render empty state when no tasks", () => {
    const { container } = renderWithTestProviders(
      <TasksList tasks={[]} canDelete={false} onDelete={vi.fn()} />
    );

    expect(container.textContent).toContain("tasks.table.empty");
  });

  it("should render task rows with title and assignee", () => {
    renderWithTestProviders(
      <TasksList tasks={tasks} canDelete={false} onDelete={vi.fn()} />
    );

    expect(screen.getByText(tasks[0].title)).toBeInTheDocument();
    expect(screen.getByText(tasks[1].title)).toBeInTheDocument();
    expect(screen.getByText(tasks[2].title)).toBeInTheDocument();
  });

  it("should render assignee name or dash for null", () => {
    const tasksWithMixedAssignee = [
      taskMother.getRandomTask({ id: "t-1", assignee: "Alice" }),
      taskMother.getRandomTask({ id: "t-2", assignee: null })
    ];

    renderWithTestProviders(
      <TasksList
        tasks={tasksWithMixedAssignee}
        canDelete={false}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getAllByText("-").length).toBeGreaterThanOrEqual(1);
  });

  it("should render delete buttons when canDelete is true", () => {
    renderWithTestProviders(
      <TasksList tasks={tasks} canDelete={true} onDelete={vi.fn()} />
    );

    const deleteButtons = screen.getAllByRole("button", {
      name: /delete/i
    });
    expect(deleteButtons).toHaveLength(tasks.length);
  });

  it("should not render delete buttons when canDelete is false", () => {
    (useLoggedUser as Mock).mockReturnValue({
      user: userMother.getMockUser({ permissions: [] })
    });

    renderWithTestProviders(
      <TasksList tasks={tasks} canDelete={false} onDelete={vi.fn()} />
    );

    const deleteButtons = screen.queryAllByRole("button", {
      name: /delete/i
    });
    expect(deleteButtons).toHaveLength(0);
  });

  it("should match snapshot with tasks", () => {
    // Use fixed data for deterministic snapshots
    const { container } = renderWithTestProviders(
      <TasksList tasks={fixedTasks} canDelete={true} onDelete={vi.fn()} />
    );

    expect(container).toMatchSnapshot();
  });
});

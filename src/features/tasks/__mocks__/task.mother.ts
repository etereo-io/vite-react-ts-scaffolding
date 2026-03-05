import { faker } from "@faker-js/faker";

import { API_DEFAULT_LIMIT } from "@/app/features/api/api.constants";

import { TaskPriority, TaskStatus } from "../tasks.enums";
import type { TaskResponse } from "../tasks.types";

function getRandomTask(overrides?: Partial<TaskResponse>): TaskResponse {
  const createdAt = faker.date.recent({ days: 30 }).toISOString();
  const updatedAt = faker.date
    .between({ from: createdAt, to: new Date() })
    .toISOString();

  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence({ min: 3, max: 8 }),
    description: faker.lorem.paragraph(),
    status: faker.helpers.enumValue(TaskStatus),
    priority: faker.helpers.enumValue(TaskPriority),
    assignee:
      faker.helpers.maybe(() => faker.person.fullName(), {
        probability: 0.7
      }) ?? null,
    dueDate:
      faker.helpers.maybe(() => faker.date.soon({ days: 30 }).toISOString(), {
        probability: 0.8
      }) ?? null,
    createdAt,
    updatedAt,
    ...overrides
  };
}

function getRandomList(
  count = API_DEFAULT_LIMIT,
  overrides?: Partial<TaskResponse>
): TaskResponse[] {
  return Array.from({ length: count }, () => getRandomTask(overrides));
}

function getRandomPage(
  offset = 0,
  limit = API_DEFAULT_LIMIT
): {
  data: TaskResponse[];
  total: number;
  offset: number;
  limit: number;
} {
  const total = 50;
  const data = Array.from(
    { length: Math.min(limit, total - offset) },
    (_, index) => getRandomTask({ id: `task-${offset + index}` })
  );

  return {
    data,
    total,
    offset,
    limit
  };
}

export const taskMother = {
  getRandomTask,
  getRandomList,
  getRandomPage
};

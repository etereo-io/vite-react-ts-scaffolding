import { openMockStore } from "@/lib/storage/indexed-db";

import type { TaskResponse } from "../tasks.types";
import { taskMother } from "./task.mother";

const taskStore = openMockStore<TaskResponse>("tasks");

async function ensureInitialized(): Promise<void> {
  await taskStore.initialize(taskMother.getRandomList(50));
}

async function getAll(): Promise<TaskResponse[]> {
  await ensureInitialized();
  return taskStore.getAll();
}

async function getById(id: string): Promise<TaskResponse | undefined> {
  await ensureInitialized();
  return taskStore.getById(id);
}

async function create(item: TaskResponse): Promise<void> {
  await ensureInitialized();
  await taskStore.put(item);
}

async function update(id: string, item: TaskResponse): Promise<void> {
  await ensureInitialized();
  const existing = await taskStore.getById(id);
  if (!existing) {
    throw new Error(`Task with id ${id} not found`);
  }
  await taskStore.put({ ...existing, ...item, id });
}

async function remove(id: string): Promise<void> {
  await ensureInitialized();
  await taskStore.delete(id);
}

async function reset(): Promise<void> {
  await taskStore.clear();
  await taskStore.initialize(taskMother.getRandomList(50));
}

export const tasksMockDb = {
  getAll,
  getById,
  create,
  update,
  remove,
  reset
};

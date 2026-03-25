import { setupWorker } from "msw/browser";

import { getAllMockHandlers } from "@/app/features/modules/modules.helpers";

let workerInstance: ReturnType<typeof setupWorker> | undefined;

export async function getWorker() {
  if (!workerInstance) {
    const handlers = await getAllMockHandlers();
    workerInstance = setupWorker(...handlers);
  }
  return workerInstance;
}

import { setupWorker } from "msw/browser";

import { getAllMockHandlers } from "@/app/features/modules/modules.helpers";

export const worker = setupWorker(...getAllMockHandlers());

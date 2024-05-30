import { setupWorker } from "msw/browser";

import { getAllMockHandlers } from "@/app/modules/modules.helpers";

export const worker = setupWorker(...getAllMockHandlers());

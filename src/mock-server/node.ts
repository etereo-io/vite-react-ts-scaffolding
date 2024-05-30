import { setupServer } from "msw/node";

import { getAllMockHandlers } from "@/app/modules/modules.helpers";

export const server = setupServer(...getAllMockHandlers());

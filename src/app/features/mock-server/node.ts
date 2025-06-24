import { type SetupServerApi, setupServer } from "msw/node";

import { getAllMockHandlers } from "@/app/features/modules/modules.helpers";

export type GlobalThis = typeof globalThis & { mockServer: SetupServerApi };

// use globalThis to store the server instance as singleton
// avoid problems with vite.setup cached imports
if (!(globalThis as GlobalThis).mockServer) {
  (globalThis as GlobalThis).mockServer = setupServer(...getAllMockHandlers());
}
export const server = (globalThis as GlobalThis).mockServer;

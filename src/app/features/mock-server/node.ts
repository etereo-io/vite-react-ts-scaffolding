import { type SetupServerApi, setupServer } from "msw/node";

import { getAllMockHandlers } from "@/app/features/modules/modules.helpers";

export type GlobalThis = typeof globalThis & {
  mockServer: SetupServerApi | undefined;
};

// use globalThis to store the server instance as singleton
// avoid problems with vite.setup cached imports
export function getServer(): SetupServerApi | undefined {
  return (globalThis as GlobalThis).mockServer;
}

export async function createServer(): Promise<SetupServerApi> {
  if (!(globalThis as GlobalThis).mockServer) {
    const handlers = await getAllMockHandlers();
    (globalThis as GlobalThis).mockServer = setupServer(...handlers);
  }
  // biome-ignore lint/style/noNonNullAssertion: checked above
  return (globalThis as GlobalThis).mockServer!;
}

// Synchronous access for test files (available after createServer() resolves in beforeAll)
export const server = new Proxy({} as SetupServerApi, {
  get(_target, prop, receiver) {
    const instance = (globalThis as GlobalThis).mockServer;
    if (!instance) {
      throw new Error(
        "Mock server not initialized. Ensure createServer() has been awaited in beforeAll."
      );
    }
    return Reflect.get(instance, prop, receiver);
  }
});

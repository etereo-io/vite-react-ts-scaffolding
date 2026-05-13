import { afterAll, afterEach, beforeAll } from "vitest";
import { mockServerConfig } from "@/app/features/mock-server/constants";
import { createServer, getServer } from "@/app/features/mock-server/node";

/**
 * Registers MSW lifecycle hooks for the current test file.
 * Opt-in: call once at the top of any test file that uses `server.use(...)`.
 *
 * Kept opt-in because most unit tests don't need MSW. Running
 * `setupServer()` + `server.listen()` inside `vitest.setup.ts` would pay that
 * cost on every single test file (~50-100ms × N files), wasted on the majority
 * of the suite.
 */
export function setupMockServer() {
  beforeAll(async () => {
    const server = await createServer();
    server.listen(mockServerConfig);
  });

  afterEach(() => {
    getServer()?.resetHandlers();
  });

  afterAll(() => {
    getServer()?.close();
  });
}

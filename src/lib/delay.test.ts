import { delay } from "./delay";

describe("delay", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    vi.resetModules(); //
    process.env = { ...OLD_ENV };
    vi.useFakeTimers();
  });

  afterEach(() => {
    process.env = OLD_ENV;
    vi.clearAllTimers();
  });

  test("executes the provided function after the specified delay", async () => {
    const mockFn = vi.fn();
    const delayMs = 1000;

    const promise = delay(mockFn, delayMs);

    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(delayMs);

    await promise;

    expect(mockFn).toHaveBeenCalled();
  });

  test("executes the provided function after the default delay if not specified", async () => {
    const mockFn = vi.fn();

    const promise = delay(mockFn);

    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);

    await promise;

    expect(mockFn).toHaveBeenCalled();
  });

  test("executes the provided function after the default delay (MOCK_SERVER_DEFAULT_DELAY) if not specified", async () => {
    process.env.MOCK_SERVER_DEFAULT_DELAY = "300";
    const mockFn = vi.fn();

    const promise = delay(mockFn);

    expect(mockFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);

    await promise;

    expect(mockFn).toHaveBeenCalled();
  });
});

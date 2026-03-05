import { afterEach, describe, expect, test } from "vitest";
import { clearAccessToken, getAccessToken, setAccessToken } from "./auth.token";

describe("auth token store", () => {
  afterEach(() => {
    clearAccessToken();
  });

  test("getAccessToken returns null when no token is set", () => {
    expect(getAccessToken()).toBeNull();
  });

  test("setAccessToken stores the token", () => {
    setAccessToken("test-token-123");

    expect(getAccessToken()).toBe("test-token-123");
  });

  test("setAccessToken overwrites a previously stored token", () => {
    setAccessToken("first-token");
    setAccessToken("second-token");

    expect(getAccessToken()).toBe("second-token");
  });

  test("clearAccessToken removes the stored token", () => {
    setAccessToken("token-to-clear");
    clearAccessToken();

    expect(getAccessToken()).toBeNull();
  });

  test("clearAccessToken is safe to call when no token is set", () => {
    clearAccessToken();

    expect(getAccessToken()).toBeNull();
  });
});

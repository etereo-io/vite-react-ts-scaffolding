import { generateId, generateUUID } from "./id";

describe("generateUUID", () => {
  test("returns a valid UUID v4 format", () => {
    const uuid = generateUUID();
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(uuid).toMatch(uuidRegex);
  });

  test("generates unique UUIDs", () => {
    const uuid1 = generateUUID();
    const uuid2 = generateUUID();
    expect(uuid1).not.toBe(uuid2);
  });
});

describe("generateId", () => {
  test("returns a string of 8 alphanumeric characters without prefix", () => {
    const id = generateId();
    expect(id).toMatch(/^[a-z0-9]{1,8}$/);
  });

  test("prepends prefix with underscore separator", () => {
    const id = generateId("user");
    expect(id).toMatch(/^user_[a-z0-9]{1,8}$/);
  });

  test("generates unique IDs", () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  test("handles empty string prefix", () => {
    const id = generateId("");
    expect(id).toMatch(/^[a-z0-9]{1,8}$/);
  });

  test("handles prefix with special characters", () => {
    const id = generateId("org-item");
    expect(id).toMatch(/^org-item_[a-z0-9]{1,8}$/);
  });
});

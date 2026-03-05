import "fake-indexeddb/auto";
import { MockDatabase, openMockStore } from "@/lib/storage/indexed-db";

interface TestItem {
  id: string;
  name: string;
  value: number;
}

describe("MockDatabase", () => {
  let db: MockDatabase<TestItem>;

  beforeEach(() => {
    db = new MockDatabase<TestItem>("test-store");
  });

  afterEach(async () => {
    await db.clear();
  });

  describe("put and getById", () => {
    it("stores and retrieves an item by id", async () => {
      const item: TestItem = { id: "1", name: "test", value: 42 };

      await db.put(item);
      const result = await db.getById("1");

      expect(result).toEqual(item);
    });

    it("returns undefined for non-existent id", async () => {
      const result = await db.getById("non-existent");

      expect(result).toBeUndefined();
    });

    it("overwrites existing item with same id", async () => {
      const original: TestItem = { id: "1", name: "original", value: 1 };
      const updated: TestItem = { id: "1", name: "updated", value: 2 };

      await db.put(original);
      await db.put(updated);
      const result = await db.getById("1");

      expect(result).toEqual(updated);
    });
  });

  describe("getAll", () => {
    it("returns empty array when store is empty", async () => {
      const result = await db.getAll();

      expect(result).toEqual([]);
    });

    it("returns all stored items", async () => {
      const items: TestItem[] = [
        { id: "1", name: "first", value: 1 },
        { id: "2", name: "second", value: 2 },
        { id: "3", name: "third", value: 3 }
      ];

      for (const item of items) {
        await db.put(item);
      }

      const result = await db.getAll();

      expect(result).toHaveLength(3);
      expect(result).toEqual(expect.arrayContaining(items));
    });
  });

  describe("delete", () => {
    it("removes an item by id", async () => {
      const item: TestItem = { id: "1", name: "test", value: 42 };

      await db.put(item);
      await db.delete("1");
      const result = await db.getById("1");

      expect(result).toBeUndefined();
    });

    it("does not throw when deleting non-existent item", async () => {
      await expect(db.delete("non-existent")).resolves.not.toThrow();
    });
  });

  describe("clear", () => {
    it("removes all items from the store", async () => {
      await db.put({ id: "1", name: "first", value: 1 });
      await db.put({ id: "2", name: "second", value: 2 });

      await db.clear();
      const result = await db.getAll();

      expect(result).toEqual([]);
    });
  });

  describe("initialize", () => {
    it("seeds data when store is empty", async () => {
      const seedData: TestItem[] = [
        { id: "1", name: "first", value: 1 },
        { id: "2", name: "second", value: 2 }
      ];

      await db.initialize(seedData);
      const result = await db.getAll();

      expect(result).toHaveLength(2);
      expect(result).toEqual(expect.arrayContaining(seedData));
    });

    it("does not overwrite existing data", async () => {
      const existingItem: TestItem = {
        id: "existing",
        name: "existing",
        value: 99
      };
      await db.put(existingItem);

      const seedData: TestItem[] = [
        { id: "1", name: "first", value: 1 },
        { id: "2", name: "second", value: 2 }
      ];

      await db.initialize(seedData);
      const result = await db.getAll();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(existingItem);
    });
  });
});

describe("openMockStore", () => {
  it("returns a MockDatabase instance", () => {
    const store = openMockStore<TestItem>("test-store");

    expect(store).toBeInstanceOf(MockDatabase);
  });

  it("creates separate stores for different store names", async () => {
    const storeA = openMockStore<TestItem>("store-a");
    const storeB = openMockStore<TestItem>("store-b");

    await storeA.put({ id: "1", name: "a-item", value: 1 });
    await storeB.put({ id: "1", name: "b-item", value: 2 });

    const resultA = await storeA.getById("1");
    const resultB = await storeB.getById("1");

    expect(resultA?.name).toBe("a-item");
    expect(resultB?.name).toBe("b-item");

    await storeA.clear();
    await storeB.clear();
  });
});

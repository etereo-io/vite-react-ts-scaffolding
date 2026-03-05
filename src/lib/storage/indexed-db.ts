const DB_NAME = "mock-data" as const;

interface WithId {
  id: string;
}

/**
 * Opens the database and ensures the requested object store exists.
 * If the store does not exist, the database version is incremented
 * and the store is created during the upgrade transaction.
 */
function openDatabase(storeName: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      const db = request.result;

      if (db.objectStoreNames.contains(storeName)) {
        resolve(db);
        return;
      }

      // Store does not exist: close and reopen with incremented version
      const nextVersion = db.version + 1;
      db.close();

      const upgradeRequest = indexedDB.open(DB_NAME, nextVersion);

      upgradeRequest.onupgradeneeded = () => {
        const upgradedDb = upgradeRequest.result;
        if (!upgradedDb.objectStoreNames.contains(storeName)) {
          upgradedDb.createObjectStore(storeName, { keyPath: "id" });
        }
      };

      upgradeRequest.onsuccess = () => resolve(upgradeRequest.result);
      upgradeRequest.onerror = () => reject(upgradeRequest.error);
    };

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id" });
      }
    };
  });
}

export class MockDatabase<T extends WithId> {
  constructor(private readonly storeName: string) {}

  async getAll(): Promise<T[]> {
    const db = await openDatabase(this.storeName);
    try {
      return await new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, "readonly");
        const store = transaction.objectStore(this.storeName);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result as T[]);
        request.onerror = () => reject(request.error);
      });
    } finally {
      db.close();
    }
  }

  async getById(id: string): Promise<T | undefined> {
    const db = await openDatabase(this.storeName);
    try {
      return await new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, "readonly");
        const store = transaction.objectStore(this.storeName);
        const request = store.get(id);

        request.onsuccess = () => resolve(request.result as T | undefined);
        request.onerror = () => reject(request.error);
      });
    } finally {
      db.close();
    }
  }

  async put(item: T): Promise<void> {
    const db = await openDatabase(this.storeName);
    try {
      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(this.storeName, "readwrite");
        const store = transaction.objectStore(this.storeName);
        const request = store.put(item);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } finally {
      db.close();
    }
  }

  async delete(id: string): Promise<void> {
    const db = await openDatabase(this.storeName);
    try {
      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(this.storeName, "readwrite");
        const store = transaction.objectStore(this.storeName);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } finally {
      db.close();
    }
  }

  async clear(): Promise<void> {
    const db = await openDatabase(this.storeName);
    try {
      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(this.storeName, "readwrite");
        const store = transaction.objectStore(this.storeName);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } finally {
      db.close();
    }
  }

  async initialize(items: T[]): Promise<void> {
    const existing = await this.getAll();
    if (existing.length === 0) {
      const db = await openDatabase(this.storeName);
      try {
        await new Promise<void>((resolve, reject) => {
          const transaction = db.transaction(this.storeName, "readwrite");
          const store = transaction.objectStore(this.storeName);

          for (const item of items) {
            store.put(item);
          }

          transaction.oncomplete = () => resolve();
          transaction.onerror = () => reject(transaction.error);
        });
      } finally {
        db.close();
      }
    }
  }
}

export function openMockStore<T extends WithId>(
  storeName: string
): MockDatabase<T> {
  return new MockDatabase<T>(storeName);
}

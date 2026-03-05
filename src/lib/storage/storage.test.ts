import {
  cleanOldStorageVersions,
  getAppVersion,
  getStorageKey,
  storage
} from "@/lib/storage/storage";

describe("getAppVersion", () => {
  afterEach(() => {
    document.head.innerHTML = "";
  });

  it("returns version from meta tag when present", () => {
    const meta = document.createElement("meta");
    meta.setAttribute("name", "app-version");
    meta.setAttribute("content", "1.2.3-abc123");
    document.head.appendChild(meta);

    expect(getAppVersion()).toBe("1.2.3-abc123");
  });

  it("returns fallback version when meta tag is missing", () => {
    expect(getAppVersion()).toBe("0.0.0-unknown");
  });

  it("returns fallback version when meta tag has no content attribute", () => {
    const meta = document.createElement("meta");
    meta.setAttribute("name", "app-version");
    document.head.appendChild(meta);

    expect(getAppVersion()).toBe("0.0.0-unknown");
  });
});

describe("getStorageKey", () => {
  afterEach(() => {
    document.head.innerHTML = "";
  });

  it("returns prefixed key with app name and version", () => {
    const meta = document.createElement("meta");
    meta.setAttribute("name", "app-version");
    meta.setAttribute("content", "1.0.0");
    document.head.appendChild(meta);

    expect(getStorageKey("theme")).toBe(
      "vite-react-ts-scaffolding:v1.0.0:theme"
    );
  });

  it("uses fallback version when no meta tag is present", () => {
    expect(getStorageKey("theme")).toBe(
      "vite-react-ts-scaffolding:v0.0.0-unknown:theme"
    );
  });
});

describe("cleanOldStorageVersions", () => {
  afterEach(() => {
    localStorage.clear();
    document.head.innerHTML = "";
  });

  it("removes storage entries from older versions", () => {
    const meta = document.createElement("meta");
    meta.setAttribute("name", "app-version");
    meta.setAttribute("content", "2.0.0");
    document.head.appendChild(meta);

    localStorage.setItem("vite-react-ts-scaffolding:v1.0.0:theme", "dark");
    localStorage.setItem("vite-react-ts-scaffolding:v1.5.0:user", "test");
    localStorage.setItem("vite-react-ts-scaffolding:v2.0.0:theme", "light");
    localStorage.setItem("unrelated-key", "value");

    cleanOldStorageVersions();

    expect(
      localStorage.getItem("vite-react-ts-scaffolding:v1.0.0:theme")
    ).toBeNull();
    expect(
      localStorage.getItem("vite-react-ts-scaffolding:v1.5.0:user")
    ).toBeNull();
    expect(localStorage.getItem("vite-react-ts-scaffolding:v2.0.0:theme")).toBe(
      "light"
    );
    expect(localStorage.getItem("unrelated-key")).toBe("value");
  });

  it("does nothing when no old versions exist", () => {
    const meta = document.createElement("meta");
    meta.setAttribute("name", "app-version");
    meta.setAttribute("content", "1.0.0");
    document.head.appendChild(meta);

    localStorage.setItem("vite-react-ts-scaffolding:v1.0.0:theme", "dark");

    cleanOldStorageVersions();

    expect(localStorage.getItem("vite-react-ts-scaffolding:v1.0.0:theme")).toBe(
      "dark"
    );
  });
});

describe("storage", () => {
  afterEach(() => {
    localStorage.clear();
    document.head.innerHTML = "";
  });

  it("setItem stores value with prefixed key", () => {
    storage.setItem("theme", "dark");

    const expectedKey = getStorageKey("theme");
    expect(localStorage.getItem(expectedKey)).toBe("dark");
  });

  it("getItem retrieves value by prefixed key", () => {
    const expectedKey = getStorageKey("theme");
    localStorage.setItem(expectedKey, "dark");

    expect(storage.getItem("theme")).toBe("dark");
  });

  it("getItem returns null for non-existent key", () => {
    expect(storage.getItem("nonexistent")).toBeNull();
  });

  it("removeItem removes value by prefixed key", () => {
    storage.setItem("theme", "dark");
    storage.removeItem("theme");

    expect(storage.getItem("theme")).toBeNull();
  });
});

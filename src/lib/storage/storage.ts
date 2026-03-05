const APP_NAME = "vite-react-ts-scaffolding" as const;

export function getAppVersion(): string {
  if (typeof document !== "undefined") {
    const meta = document.querySelector('meta[name="app-version"]');
    if (meta) return meta.getAttribute("content") ?? "0.0.0-unknown";
  }
  return "0.0.0-unknown";
}

export function getStorageKey(key: string): string {
  return `${APP_NAME}:v${getAppVersion()}:${key}`;
}

export function cleanOldStorageVersions(): void {
  const currentPrefix = `${APP_NAME}:v${getAppVersion()}:`;
  const appPrefix = `${APP_NAME}:v`;

  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key?.startsWith(appPrefix) && !key.startsWith(currentPrefix)) {
      localStorage.removeItem(key);
    }
  }
}

export const storage = {
  getItem(key: string): string | null {
    return localStorage.getItem(getStorageKey(key));
  },
  setItem(key: string, value: string): void {
    localStorage.setItem(getStorageKey(key), value);
  },
  removeItem(key: string): void {
    localStorage.removeItem(getStorageKey(key));
  }
};

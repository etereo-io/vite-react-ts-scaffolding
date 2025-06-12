import yaml from "js-yaml";
import type { Config } from "./config.types";

// use globalThis to store the config instance as singleton
// avoid problems with vite.setup isolation mode
// biome-ignore lint/style/useNamingConvention: <explanation>
export type GlobalThis = typeof globalThis & { APP_CONFIG: Config };

if (!(globalThis as GlobalThis).APP_CONFIG) {
  (globalThis as GlobalThis).APP_CONFIG = {};
}

export const config = (globalThis as GlobalThis).APP_CONFIG;

export async function loadConfig({
  providedConfig,
  url
}: {
  providedConfig: Config | null;
  url: string;
}) {
  if (providedConfig) {
    Object.assign(config, providedConfig);
    return Promise.resolve(config);
  }
  return loadConfigFromUrl(url);
}

/**
 * Load configuration from URL with timeout
 */
export async function loadConfigFromUrl(
  url: string
): Promise<Partial<Config> | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  const response = await fetch(url, {
    signal: controller.signal,
    cache: "no-cache"
  });

  clearTimeout(timeoutId);

  if (!response.ok) {
    throw new Error(`Error loading config: ${response.statusText}`);
  }
  const textConfig = await response.text();
  const yamlConfig = yaml.load(textConfig) as Config;

  Object.assign(config, yamlConfig);

  return config;
}

export function getConfig<T = string>(
  key: string,
  {
    defaultValue,
    required = true
  }: {
    readonly defaultValue?: T;
    readonly required?: boolean;
  } = {}
): T | undefined {
  try {
    const value = key
      .split(".")
      .reduce((acc, part) => acc && acc[part], config) as T;
    if (value === undefined && required) {
      throw new Error(`Config key not found: ${key}`);
    }
    return value ?? defaultValue;
  } catch (_e) {
    throw new Error(`Error getting config for key: ${key}`);
  }
}

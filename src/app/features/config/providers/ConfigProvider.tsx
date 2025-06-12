import React, { createContext, useEffect, useState, useCallback } from "react";
import { CONFIG_DEFAULT_URL } from "../config.constants";
import { loadConfig } from "../config.service";
import { Config } from "../config.types";

export interface ConfigLoadingState {
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly error: Error | null;
}

export interface ConfigProviderProps {
  readonly children: React.ReactNode;
  readonly configUrl?: string;
  readonly config: Config | null;
}

interface ConfigContextValue {
  readonly config: Config | null;
  readonly loadingState: ConfigLoadingState;
  readonly reloadConfig: () => Promise<void>;
}

const ConfigContext = createContext<ConfigContextValue | null>(null);

export function ConfigProvider({
  children,
  configUrl = CONFIG_DEFAULT_URL,
  config: initialConfig
}: ConfigProviderProps) {
  const [config, setConfig] = useState<Config | null>(initialConfig);
  const [loadingState, setLoadingState] = useState<ConfigLoadingState>({
    isLoading: true,
    isError: false,
    error: null
  });

  const loadConfiguration = useCallback(async () => {
    // If we have an initial config, use it and don't fetch
    if (initialConfig) {
      loadConfig({
        url: configUrl,
        providedConfig: initialConfig
      });

      setLoadingState({
        isLoading: false,
        isError: false,
        error: null
      });
      return;
    }

    setLoadingState({
      isLoading: true,
      isError: false,
      error: null
    });

    try {
      const loadedConfig = await loadConfig({
        url: configUrl,
        providedConfig: initialConfig
      });
      setConfig(loadedConfig);
      setLoadingState({
        isLoading: false,
        isError: false,
        error: null
      });
    } catch (error) {
      const configError =
        error instanceof Error
          ? error
          : new Error("Unknown configuration error");

      setLoadingState({
        isLoading: false,
        isError: true,
        error: configError
      });
    }
  }, [configUrl, initialConfig]);

  const reloadConfig = async () => {
    await loadConfiguration();
  };

  useEffect(() => {
    loadConfiguration();
  }, [loadConfiguration]);

  const contextValue: ConfigContextValue = {
    config,
    loadingState,
    reloadConfig
  };

  return (
    <ConfigContext.Provider value={contextValue}>
      {!!config && !loadingState.error && !loadingState.isLoading && children}
    </ConfigContext.Provider>
  );
}

export function useConfigContext(): ConfigContextValue {
  const context = React.useContext(ConfigContext);

  if (!context) {
    throw new Error("useConfigContext must be used within a ConfigProvider");
  }

  return context;
}

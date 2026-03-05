export interface AppConfig {
  app?: {
    environment?: string;
    version?: string;
  };
  endpoints?: Record<string, string>;
  features?: {
    msw?: boolean;
    debugMode?: boolean;
    analytics?: boolean;
    betaFeatures?: boolean;
  };
  analytics?: {
    measurementId?: string;
  };
  oauth?: {
    disabled?: boolean;
    clientId?: string;
    authority?: string;
    redirectUri?: string;
  };
}

export type Config = AppConfig;

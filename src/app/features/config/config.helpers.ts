import { config } from "@/app/features/config/config.service";

export function isMswEnabled(): boolean {
  return config?.features?.msw ?? false;
}

export function isDebugMode(): boolean {
  return config?.features?.debugMode ?? false;
}

export function isAnalyticsEnabled(): boolean {
  return config?.features?.analytics ?? false;
}

export function isBetaFeaturesEnabled(): boolean {
  return config?.features?.betaFeatures ?? false;
}

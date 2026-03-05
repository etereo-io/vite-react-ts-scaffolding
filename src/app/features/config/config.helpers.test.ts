import {
  isAnalyticsEnabled,
  isBetaFeaturesEnabled,
  isDebugMode,
  isMswEnabled
} from "@/app/features/config/config.helpers";
import { config } from "@/app/features/config/config.service";

describe("config helpers", () => {
  beforeEach(() => {
    // Clear all properties from the config singleton
    for (const key of Object.keys(config)) {
      delete (config as Record<string, unknown>)[key];
    }
  });

  describe("isMswEnabled", () => {
    it("returns false when features is undefined", () => {
      expect(isMswEnabled()).toBe(false);
    });

    it("returns false when msw is undefined", () => {
      Object.assign(config, { features: {} });
      expect(isMswEnabled()).toBe(false);
    });

    it("returns false when msw is false", () => {
      Object.assign(config, { features: { msw: false } });
      expect(isMswEnabled()).toBe(false);
    });

    it("returns true when msw is true", () => {
      Object.assign(config, { features: { msw: true } });
      expect(isMswEnabled()).toBe(true);
    });
  });

  describe("isDebugMode", () => {
    it("returns false when features is undefined", () => {
      expect(isDebugMode()).toBe(false);
    });

    it("returns false when debugMode is undefined", () => {
      Object.assign(config, { features: {} });
      expect(isDebugMode()).toBe(false);
    });

    it("returns false when debugMode is false", () => {
      Object.assign(config, { features: { debugMode: false } });
      expect(isDebugMode()).toBe(false);
    });

    it("returns true when debugMode is true", () => {
      Object.assign(config, { features: { debugMode: true } });
      expect(isDebugMode()).toBe(true);
    });
  });

  describe("isAnalyticsEnabled", () => {
    it("returns false when features is undefined", () => {
      expect(isAnalyticsEnabled()).toBe(false);
    });

    it("returns false when analytics is undefined", () => {
      Object.assign(config, { features: {} });
      expect(isAnalyticsEnabled()).toBe(false);
    });

    it("returns false when analytics is false", () => {
      Object.assign(config, { features: { analytics: false } });
      expect(isAnalyticsEnabled()).toBe(false);
    });

    it("returns true when analytics is true", () => {
      Object.assign(config, { features: { analytics: true } });
      expect(isAnalyticsEnabled()).toBe(true);
    });
  });

  describe("isBetaFeaturesEnabled", () => {
    it("returns false when features is undefined", () => {
      expect(isBetaFeaturesEnabled()).toBe(false);
    });

    it("returns false when betaFeatures is undefined", () => {
      Object.assign(config, { features: {} });
      expect(isBetaFeaturesEnabled()).toBe(false);
    });

    it("returns false when betaFeatures is false", () => {
      Object.assign(config, { features: { betaFeatures: false } });
      expect(isBetaFeaturesEnabled()).toBe(false);
    });

    it("returns true when betaFeatures is true", () => {
      Object.assign(config, { features: { betaFeatures: true } });
      expect(isBetaFeaturesEnabled()).toBe(true);
    });
  });
});

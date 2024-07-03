/**
 * Enum representing different sale bundle types.
 */
export enum BundleTypes {
  INTERNET = "internet",
  MOBILE_ONLY = "mobile-only",
  MI_FIJO = "mi-fijo",
}

/**
 * Interface representing a bundle.
 */
export interface Bundle {
  id: string;
  type: BundleTypes;
}

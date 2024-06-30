/**
 * Enum representing different sector types.
 */
export enum SectorTypes {
  RESIDENTIAL = "residential",
  COMPANY = "company",
  FREELANCER = "freelancer",
}

/**
 * Enum representing different sale bundle types.
 */
export enum SaleBundleTypes {
  INTERNET = "internet",
  MOBILE_ONLY = "mobile-only",
  MY_LANDLINE = "my-landline",
}

/**
 * Enum representing different client identity types.
 */
export enum ClientIdentityTypes {
  NIF = "nif",
  NIE = "nie",
}

/**
 * Enum representing different client gender types.
 */
export enum ClientGenderTypes {
  MASCULINE = "masculine",
  FEMENINE = "femenine",
}

/**
 * Enum representing different payment types.
 */
export enum PaymentType {
  POST_PAID = "post-paid",
  CLASSIC_PREPAID = "classic_prepaid",
  AUTOMATIC_PREPAID = "automatic_prepaid",
}

/**
 * Interface representing a client.
 */
export interface Client {
  sector: SectorTypes;
  id: string;
  dni: string;
  type: ClientIdentityTypes;
  firstName: string;
  lastName: string;
  secondLastName: string;
  gender: ClientGenderTypes;
  birthDate: Date;
  country: string;
  language: string;
  phoneNumber: string;
  emailAddress: string;
  physicalAddress: string;
}

/**
 * Interface representing a bundle.
 */
export interface Bundle {
  id: string;
  type: SaleBundleTypes;
}

/**
 * Interface representing a sale.
 */
export interface Sale {
  bundle: Bundle;
  client: Client;
  payment: {
    tyoe: PaymentType;
    clientToBill: Client;
    bankAccount: string;
  };
}

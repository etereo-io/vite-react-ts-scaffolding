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
 * Enum representing different sector types.
 */
export enum SectorTypes {
  RESIDENTIAL = "residential",
  COMPANY = "company",
  FREELANCER = "freelancer",
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
  gender: ClientGenderTypes;
  birthDate: Date;
  country: string;
  language: string;
  phoneNumber: string;
  emailAddress: string;
  physicalAddress: string;
}

import { z } from "zod";

import { ClientGenderTypes, ClientIdentityTypes, SectorTypes } from "@/clients/clients.types";

export const newSaleSchema = z.object({
  client: z.object({
    sector: z.nativeEnum(SectorTypes),
    dni: z.string().regex(/^[0-9]{8}[A-Z]$/, "debe ser un DNI español"),
    type: z.nativeEnum(ClientIdentityTypes),
    firstName: z.string(),
    lastName: z.string(),
    gender: z.nativeEnum(ClientGenderTypes),
    country: z.string(),
    language: z.string(),
    phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "phone number"),
    emailAddress: z.string().email("an email"),
    physicalAddress: z.string(),
  }),
});

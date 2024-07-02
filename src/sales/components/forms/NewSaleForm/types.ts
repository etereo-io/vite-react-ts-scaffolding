// Dependencies
import { z } from "zod";

// ValidationSchema
import { newSaleSchema } from "./schema";

// Type for the form inputs derived from the Zod schema
export type FormValues = z.infer<typeof newSaleSchema>;

export interface NewSaleFormProps {
  isLoading: boolean;
  onSubmit: (data: FormValues) => void;
}

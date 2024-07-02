import { Bundle } from "../bundles/bundles.types";
import { Client } from "../clients/clients.types";

/**
 * Enum representing different payment types.
 */
export enum PaymentType {
  POST_PAID = "post-paid",
  CLASSIC_PREPAID = "classic_prepaid",
  AUTOMATIC_PREPAID = "automatic_prepaid",
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

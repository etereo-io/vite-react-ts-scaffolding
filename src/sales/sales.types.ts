import { Bundle } from "../bundles/bundles.types";
import { Client } from "../clients/clients.types";

export const EVENT_SALE_CREATE = "sale_create";

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
  id: string;
  orderNumber: string;
  bundle: Bundle;
  client: Client;
  payment: {
    tyoe: PaymentType;
    clientToBill: Client;
    bankAccount: string;
  };
  createdAt: Date;
}

/**
 * Interface representing filters for sales queries.
 */
export interface SalesFilters {
  offset?: number;
  limit?: number;
}

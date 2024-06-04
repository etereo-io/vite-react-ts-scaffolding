export enum OrderStatus {
  PENDING = "pending",
  CLOSED = "closed",
}

export interface Order {
  id: string;
  date: string;
  name: string;
  shipTo: string;
  paymentMethod: string;
  amount: number;
  status: OrderStatus;
}

export interface OrdersFilters {
  offset?: number;
  limit?: number;
  status?: OrderStatus;
}

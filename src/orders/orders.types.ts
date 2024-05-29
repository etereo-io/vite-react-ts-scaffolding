export interface Order {
  id: number;
  date: string;
  name: string;
  shipTo: string;
  paymentMethod: string;
  amount: number;
}

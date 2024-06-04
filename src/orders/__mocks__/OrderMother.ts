import { faker } from "@faker-js/faker";

import { API_DEFAULT_LIMIT } from "@/app/api";

import { Order, OrderStatus } from "../orders.types";

export class OrderMother {
  static getRandomOrder(order?: Partial<Order>) {
    return {
      id: faker.string.uuid(),
      date: faker.date.recent().toISOString(),
      name: faker.person.fullName(),
      shipTo: faker.location.direction(),
      paymentMethod: faker.commerce.price(),
      amount: faker.finance.amount(),
      status: faker.helpers.enumValue(OrderStatus),
      ...order,
    } as Order;
  }

  static getRandomList(length = API_DEFAULT_LIMIT, order?: Partial<Order>) {
    return Array.from({ length }, () => this.getRandomOrder(order));
  }

  static getRandomPage(offset = 0, limit = API_DEFAULT_LIMIT, order?: Partial<Order>) {
    return Array.from({ length: limit }, (_, index) =>
      this.getRandomOrder({ ...order, id: `order-${offset + index}` }),
    );
  }
}

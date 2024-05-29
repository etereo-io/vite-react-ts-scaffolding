import { faker } from "@faker-js/faker";

import { Order } from "../orders.types";

export class OrderMother {
  static getRandomOrder(order?: Partial<Order>) {
    return {
      id: faker.string.uuid(),
      date: faker.date.recent().toISOString(),
      name: faker.person.fullName(),
      shipTo: faker.location.direction(),
      paymentMethod: faker.commerce.price(),
      amount: faker.finance.amount(),
      ...order,
    };
  }

  static getRandomList(length = 10, order?: Partial<Order>) {
    return Array.from({ length }, () => this.getRandomOrder(order));
  }
}

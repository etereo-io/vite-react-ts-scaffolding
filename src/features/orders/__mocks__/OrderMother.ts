import { faker } from "@faker-js/faker";

import { API_DEFAULT_LIMIT } from "@/app/features/api/api.contants";

import { type Order, OrderStatus } from "../orders.types";

function getRandomOrder(order?: Partial<Order>) {
  return {
    id: faker.string.uuid(),
    date: faker.date.recent().toISOString(),
    name: faker.person.fullName(),
    shipTo: faker.location.direction(),
    paymentMethod: faker.commerce.price(),
    amount: faker.finance.amount(),
    status: faker.helpers.enumValue(OrderStatus),
    ...order
  } as Order;
}

function getRandomList(length = API_DEFAULT_LIMIT, order?: Partial<Order>) {
  return Array.from({ length }, () => getRandomOrder(order));
}

function getRandomPage(
  offset = 0,
  limit = API_DEFAULT_LIMIT,
  order?: Partial<Order>
) {
  return Array.from({ length: limit }, (_, index) =>
    getRandomOrder({ ...order, id: `order-${offset + index}` })
  );
}

export const OrderMother = {
  getRandomOrder,
  getRandomList,
  getRandomPage
};

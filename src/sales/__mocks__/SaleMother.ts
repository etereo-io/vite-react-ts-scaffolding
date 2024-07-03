import { faker } from "@faker-js/faker";

import { API_DEFAULT_LIMIT } from "@/app/api";
import { BundleTypes } from "@/bundles/bundles.types";

import { Sale } from "../sales.types";

export class SaleMother {
  static getRandomOrder(sale?: Partial<Sale>) {
    return {
      id: faker.string.uuid(),
      orderNumber: faker.string.numeric(6),
      bundle: {
        id: faker.string.uuid(),
        type: faker.helpers.arrayElement(Object.values(BundleTypes)),
      },
      client: {
        id: faker.string.numeric(7),
      },
      createdAt: faker.date.past(),
      ...sale,
    } as Sale;
  }

  static getRandomList(length = API_DEFAULT_LIMIT, order?: Partial<Sale>) {
    return Array.from({ length }, () => this.getRandomOrder(order));
  }

  static getRandomPage(offset = 0, limit = API_DEFAULT_LIMIT, order?: Partial<Sale>) {
    return Array.from({ length: limit }, (_, index) => this.getRandomOrder({ ...order, id: `sale-${offset + index}` }));
  }
}

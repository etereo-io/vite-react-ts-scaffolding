import { faker } from "@faker-js/faker";

import { Deposit } from "../deposits.types";

export class DepositsMother {
  static getDeposits(deposit?: Partial<Deposit>) {
    return {
      id: faker.string.uuid(),
      amount: faker.finance.amount(),
      name: faker.person.fullName(),
      date: faker.date.past().toISOString(),
      ...deposit,
    } as Deposit;
  }

  static getRandomList(length = 10, deposit?: Partial<Deposit>) {
    return Array.from({ length }, () => this.getDeposits(deposit));
  }
}

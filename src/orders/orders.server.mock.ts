import { MockHandler } from "vite-plugin-mock-server";

import { delay } from "@/lib/delay";

import { OrderMother } from "./__mocks__/OrderMother";

export default (): MockHandler[] => [
  {
    pattern: `/api/orders`,
    method: "GET",
    handle: (_req, res) => {
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      delay(() => {
        res.end(JSON.stringify(OrderMother.getRandomList()));
      });
    },
  },
];

import { HttpResponse, delay, http } from "msw";

import { API_DEFAULT_LIMIT } from "@/app/api";
import { queryToObject } from "@/lib/queryparams/queryparams.helpers";

import { SaleMother } from "./__mocks__/SaleMother";
import { ERROR_SALEID_REQUIRED } from "./sales.constants";
import { DEFAULT_DELAY } from "../mock-server/constants";

const sales = SaleMother.getRandomList(100).sort(
  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
);

export const handlers = [
  http.get("/api/sales", async ({ request }) => {
    const query = queryToObject(request.url?.split("?")[1] ?? "");

    const offset = +(query.offset ?? 0);
    const limit = +(query.limit ?? API_DEFAULT_LIMIT);

    await delay(DEFAULT_DELAY);
    return HttpResponse.json({
      data: sales.slice(offset, offset + limit),
      pagination: {
        offset,
        limit,
        count: sales.length,
        hasMore: sales.length > offset + limit,
      },
    });
  }),

  http.delete("/api/sales/:saleId", async ({ params }) => {
    const saleId = params.saleId;

    if (!saleId) {
      return HttpResponse.json(
        {
          code: ERROR_SALEID_REQUIRED,
          message: "orderId is required",
        },
        { status: 400 },
      );
    }

    const saleIndex = sales.findIndex((sale) => sale.id === saleId);
    if (saleIndex === -1) {
      sales.splice(saleIndex, 1);
    }

    await delay(DEFAULT_DELAY);
    return new HttpResponse(null, { status: 204 });
  }),
];

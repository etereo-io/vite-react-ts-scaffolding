import { Orders } from "@/features/orders/components/Orders";

import { Chart } from "../components/Chart";
import { Deposits } from "../components/Deposits";

export function DashboardPage() {
  return (
    <>
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-60 flex flex-col">
          <Chart />
        </div>
      </div>

      <div className="col-span-1">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-60 flex flex-col">
          <Deposits />
        </div>
      </div>

      <div className="col-span-1 md:col-span-3">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col">
          <Orders />
        </div>
      </div>
    </>
  );
}

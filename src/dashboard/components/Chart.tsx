import * as React from "react";
import { useTranslation } from "react-i18next";

import { Title } from "@/shared/components/Title";

// Generate Sales Data
function createData(
  time: string,
  amount?: number
): { time: string; amount: number | null } {
  return { time, amount: amount ?? null };
}

const data = [
  createData("00:00", 0),
  createData("03:00", 300),
  createData("06:00", 600),
  createData("09:00", 800),
  createData("12:00", 1500),
  createData("15:00", 2000),
  createData("18:00", 2400),
  createData("21:00", 2400),
  createData("24:00", 0)
];

export function Chart() {
  const { t } = useTranslation();
  const maxAmount = 2500;

  return (
    <React.Fragment>
      <Title>{t("dashboard.chart.today")}</Title>
      <div className="w-full flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Y-axis label */}
          <div className="text-sm text-gray-600 mb-2">Sales ($)</div>

          {/* Chart area */}
          <div className="flex-1 flex items-end justify-between px-4 pb-8 border-l-2 border-b-2 border-gray-300 relative">
            {/* Y-axis ticks */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 -ml-12">
              <span>2500</span>
              <span>1250</span>
              <span>0</span>
            </div>

            {/* Bars */}
            {data.map((item, index) => {
              const height = item.amount ? (item.amount / maxAmount) * 100 : 0;
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="w-8 bg-blue-500 rounded-t-sm transition-all duration-300 hover:bg-blue-600"
                    style={{
                      height: `${height}%`,
                      minHeight: height > 0 ? "2px" : "0"
                    }}
                    title={`${item.time}: $${item.amount || 0}`}
                  />
                  <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left">
                    {item.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

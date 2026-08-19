"use client";

import { useState } from "react";
import { TrendingUp, ArrowUpRight } from "lucide-react";

export default function OverviewChart() {
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "12m">("30d");

  const chartData = {
    "7d": [
      { label: "Mon", revenue: 420, orders: 12 },
      { label: "Tue", revenue: 680, orders: 18 },
      { label: "Wed", revenue: 540, orders: 15 },
      { label: "Thu", revenue: 890, orders: 24 },
      { label: "Fri", revenue: 1120, orders: 31 },
      { label: "Sat", revenue: 1450, orders: 42 },
      { label: "Sun", revenue: 980, orders: 28 },
    ],
    "30d": [
      { label: "Week 1", revenue: 3200, orders: 84 },
      { label: "Week 2", revenue: 4500, orders: 112 },
      { label: "Week 3", revenue: 5800, orders: 145 },
      { label: "Week 4", revenue: 7100, orders: 188 },
    ],
    "12m": [
      { label: "Jan", revenue: 12400, orders: 310 },
      { label: "Feb", revenue: 14200, orders: 355 },
      { label: "Mar", revenue: 18900, orders: 460 },
      { label: "Apr", revenue: 16500, orders: 410 },
      { label: "May", revenue: 21000, orders: 520 },
      { label: "Jun", revenue: 24500, orders: 610 },
      { label: "Jul", revenue: 28900, orders: 710 },
      { label: "Aug", revenue: 32400, orders: 795 },
    ],
  };

  const currentData = chartData[timeframe];
  const maxRevenue = Math.max(...currentData.map((d) => d.revenue));
  const totalRevenue = currentData.reduce((sum, d) => sum + d.revenue, 0);

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-ink/50">
            <TrendingUp size={15} className="text-emerald-500" />
            <span>Sales & Revenue Analytics</span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-ink tabular">${totalRevenue.toLocaleString()}</h3>
            <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={13} /> +18.4%
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-xl bg-surface p-1 border border-border">
          {(["7d", "30d", "12m"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                timeframe === tf
                  ? "bg-white text-ink shadow-xs"
                  : "text-ink/60 hover:text-ink"
              }`}
            >
              {tf === "7d" ? "7 Days" : tf === "30d" ? "30 Days" : "12 Months"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="flex h-52 items-end justify-between gap-3 border-b border-border pb-2 pt-4">
          {currentData.map((item, index) => {
            const heightPercent = Math.round((item.revenue / maxRevenue) * 100);
            return (
              <div key={index} className="group relative flex flex-1 flex-col items-center h-full justify-end">
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-white shadow-md whitespace-nowrap">
                  ${item.revenue.toLocaleString()} ({item.orders} orders)
                </div>

                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full max-w-[48px] rounded-t-lg bg-gradient-to-t from-slate-900 to-indigo-600 transition-all duration-300 group-hover:from-indigo-600 group-hover:to-indigo-500"
                />
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex justify-between gap-3 text-xs font-medium text-ink/50">
          {currentData.map((item, index) => (
            <span key={index} className="flex-1 text-center truncate">
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

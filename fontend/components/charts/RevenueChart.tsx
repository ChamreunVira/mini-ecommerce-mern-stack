"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { RevenueSeriesPoint } from "@/types";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length || payload[0].value === undefined) return null;
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-md">
      <p className="text-gray-500">{label}</p>
      <p className="font-semibold text-ink">${payload[0].value.toFixed(2)}</p>
    </div>
  );
}

interface RevenueChartProps {
  data: RevenueSeriesPoint[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const ticks = data
    .filter((_, i) => i % 9 === 0)
    .map((d) => d.label);

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -12, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#f1f1f1" />
        <XAxis
          dataKey="label"
          ticks={ticks}
          tick={{ fontSize: 12, fill: "#9ca3af" }}
          tickLine={false}
          axisLine={{ stroke: "#e5e7eb" }}
          interval="preserveStart"
        />
        <YAxis
          tickFormatter={(v) => `$${v}`}
          tick={{ fontSize: 12, fill: "#9ca3af" }}
          tickLine={false}
          axisLine={false}
          width={48}
        />
        <Tooltip cursor={{ fill: "#f9fafb" }} content={<CustomTooltip />} />
        <Bar dataKey="revenue" fill="#0f172a" radius={[3, 3, 0, 0]} maxBarSize={14} />
      </BarChart>
    </ResponsiveContainer>
  );
}

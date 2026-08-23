"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { StatusDistributionItem } from "@/types";

interface LegendDotProps {
  color: string;
}

function LegendDot({ color }: LegendDotProps) {
  return (
    <span
      className="inline-block h-2.5 w-2.5 rounded-full"
      style={{ background: color }}
    />
  );
}

interface DonutChartProps {
  data: StatusDistributionItem[];
}

export default function DonutChart({ data }: DonutChartProps) {
  return (
    <div className="flex items-center gap-8">
      <div className="h-[220px] w-[220px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="status"
              innerRadius={62}
              outerRadius={100}
              paddingAngle={2}
              strokeWidth={0}
            >
              {data.map((entry) => (
                <Cell key={entry.status} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [value, name]}
              contentStyle={{
                borderRadius: 10,
                borderColor: "#e5e7eb",
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex flex-col gap-3">
        {data.map((entry) => (
          <li key={entry.status} className="flex items-center gap-2 text-sm text-gray-600">
            <LegendDot color={entry.color} />
            {entry.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

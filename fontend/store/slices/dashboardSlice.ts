import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DashboardStats, RevenueSeriesPoint, StatusDistributionItem } from "@/types";

interface DashboardState {
  range: string;
  stats: DashboardStats;
  revenueSeries: RevenueSeriesPoint[];
  orderStatusDistribution: StatusDistributionItem[];
  paymentStatusDistribution: StatusDistributionItem[];
  totalProducts: number;
}

function buildRevenueSeries(): RevenueSeriesPoint[] {
  const start = new Date("2025-08-21");
  const days = 91;
  const spikes: Record<string, number> = {
    "2025-11-05": 65,
    "2025-11-11": 28,
    "2025-11-19": 38,
  };
  const series: RevenueSeriesPoint[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    series.push({
      date: iso,
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      revenue: spikes[iso] ?? 0,
    });
  }
  return series;
}

const initialState: DashboardState = {
  range: "Last 90 days",
  stats: {
    totalRevenue: 178.0,
    totalRevenueChange: 0.0,
    totalOrders: 5,
    totalOrdersChange: 0.0,
    averageOrderValue: 35.6,
    activeCustomers: 1,
    newCustomers: 5,
  },
  revenueSeries: buildRevenueSeries(),
  orderStatusDistribution: [
    { status: "PENDING", value: 1, color: "#f2542d" },
    { status: "DELIVERED", value: 1, color: "#f5c344" },
    { status: "CONFIRMED", value: 2, color: "#14b8a6" },
    { status: "CANCELLED", value: 1, color: "#f59e0b" },
  ],
  paymentStatusDistribution: [
    { status: "PAID", value: 3, color: "#14b8a6" },
    { status: "UNPAID", value: 1, color: "#f5c344" },
    { status: "FAILED", value: 1, color: "#f2542d" },
  ],
  totalProducts: 16,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setRange(state, action: PayloadAction<string>) {
      state.range = action.payload;
    },
  },
});

export const { setRange } = dashboardSlice.actions;
export default dashboardSlice.reducer;

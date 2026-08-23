"use client";

import { useAppSelector } from "@/store/store";
import { DollarSign, ShoppingCart, TrendingUp, Users } from "lucide-react";
import StatCard from "@/components/StatCard";
import RevenueChart from "@/components/charts/RevenueChart";
import DonutChart from "@/components/charts/DonutChart";

export default function DashboardPage() {
  const {
    range,
    stats,
    revenueSeries,
    orderStatusDistribution,
    paymentStatusDistribution,
    totalProducts,
  } = useAppSelector((state) => state.dashboard);

  return (
    <div>
      <div className="flex items-start justify-between mb-9">
        <h1 className="text-4xl font-extrabold tracking-tight text-ink">Dashboard</h1>
        <select
          defaultValue={range}
          className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-ink outline-none"
        >
          <option>{range}</option>
          <option>Last 30 days</option>
          <option>Last 7 days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          trend={`${stats.totalRevenueChange.toFixed(1)}%`}
          icon={DollarSign}
        />
        <StatCard
          label="Total Orders"
          value={stats.totalOrders}
          trend={`${stats.totalOrdersChange.toFixed(1)}%`}
          icon={ShoppingCart}
        />
        <StatCard
          label="Average Order Value"
          value={`$${stats.averageOrderValue.toFixed(2)}`}
          footnote="Per order"
          icon={TrendingUp}
        />
        <StatCard
          label="Active Customers"
          value={stats.activeCustomers}
          footnote={`${stats.newCustomers} new this period`}
          icon={Users}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-ink">Revenue Over Time</h2>
          <p className="text-sm text-gray-500">Daily revenue trends</p>
          <div className="mt-4">
            <RevenueChart data={revenueSeries} />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-ink">Order Status Distribution</h2>
          <p className="text-sm text-gray-500">Current order statuses</p>
          <div className="mt-6 flex justify-center">
            <DonutChart data={orderStatusDistribution} />
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-ink">Payment Status Distribution</h2>
          <p className="text-sm text-gray-500">Payment completion rates</p>
          <div className="mt-6 flex justify-center">
            <DonutChart data={paymentStatusDistribution} />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-ink">Total Products</h2>
          <div className="mt-4 text-[28px] font-extrabold tracking-tight text-ink">
            {totalProducts}
          </div>
          <p className="mt-1.5 text-sm text-gray-500">Active products in catalog</p>
        </div>
      </div>
    </div>
  );
}

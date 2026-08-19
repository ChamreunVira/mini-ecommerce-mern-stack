"use client";

import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Package,
  FolderTree,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Clock,
  Truck,
  CheckCircle2,
} from "lucide-react";
import OverviewChart from "@/components/dashboard/OverviewChart";
import ActionDropdown from "@/components/ui/ActionDropdown";
import { store, useOrders, useProducts, useCategories } from "@/lib/store";

export default function DashboardOverviewPage() {
  const orders = useOrders();
  const products = useProducts();
  const categories = useCategories();

  const totalRevenue = orders.reduce((sum, o) => (o.paymentStatus === "Paid" ? sum + o.total : sum), 0);
  const pendingOrdersCount = orders.filter((o) => o.orderStatus === "Pending" || o.orderStatus === "Processing").length;
  const inStockProductsCount = products.filter((p) => p.inStock).length;
  const recentFiveOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-slate-900 p-6 text-white shadow-md">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary border border-primary/30">
            <TrendingUp size={13} /> Marlo Store Manager
          </span>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Overview Dashboard</h1>
          <p className="mt-1 text-xs text-white/70">
            Real-time management for sales, product inventory, order processing, and shipment status.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/products/new"
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary/90 transition-all shadow-sm"
          >
            <PlusCircle size={16} />
            Add New Product
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Revenue */}
        <div className="rounded-2xl border border-border bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink/50">Total Revenue</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign size={18} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-ink tabular">${totalRevenue.toFixed(2)}</p>
          <p className="mt-1 text-xs font-medium text-emerald-600 flex items-center gap-1">
            <TrendingUp size={13} /> +12.5% from last month
          </p>
        </div>

        {/* Card 2: Orders */}
        <div className="rounded-2xl border border-border bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink/50">Total Orders</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ShoppingBag size={18} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-ink tabular">{orders.length}</p>
          <p className="mt-1 text-xs font-medium text-amber-600 flex items-center gap-1">
            <Clock size={13} /> {pendingOrdersCount} requiring action
          </p>
        </div>

        {/* Card 3: Products */}
        <div className="rounded-2xl border border-border bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink/50">Active Products</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Package size={18} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-ink tabular">{products.length}</p>
          <p className="mt-1 text-xs font-medium text-emerald-600 flex items-center gap-1">
            <CheckCircle2 size={13} /> {inStockProductsCount} in stock
          </p>
        </div>

        {/* Card 4: Categories */}
        <div className="rounded-2xl border border-border bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink/50">Categories</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <FolderTree size={18} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-ink tabular">{categories.length}</p>
          <p className="mt-1 text-xs font-medium text-ink/50">Catalog organized</p>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="rounded-2xl border border-border bg-white p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-ink/50">Quick Actions</h3>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Link
            href="/dashboard/products/new"
            className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3 text-xs font-semibold text-ink hover:border-slate-400 hover:bg-white transition-all shadow-2xs"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
              <PlusCircle size={16} />
            </div>
            <span>Create Product</span>
          </Link>
          <Link
            href="/dashboard/orders"
            className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3 text-xs font-semibold text-ink hover:border-slate-400 hover:bg-white transition-all shadow-2xs"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <ShoppingBag size={16} />
            </div>
            <span>Update Orders</span>
          </Link>
          <Link
            href="/dashboard/categories"
            className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3 text-xs font-semibold text-ink hover:border-slate-400 hover:bg-white transition-all shadow-2xs"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white">
              <FolderTree size={16} />
            </div>
            <span>Manage Categories</span>
          </Link>
          <Link
            href="/dashboard/orders"
            className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3 text-xs font-semibold text-ink hover:border-slate-400 hover:bg-white transition-all shadow-2xs"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 text-white">
              <Truck size={16} />
            </div>
            <span>Shipment Status</span>
          </Link>
        </div>
      </div>

      {/* Analytics Chart */}
      <OverviewChart />

      {/* Recent Orders Section */}
      <div className="rounded-2xl border border-border bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <h3 className="text-base font-bold text-ink">Recent Orders</h3>
            <p className="text-xs text-ink/50">Latest customer transactions and shipping updates</p>
          </div>
          <Link
            href="/dashboard/orders"
            className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
          >
            View All Orders <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-[11px] font-bold uppercase tracking-wider text-ink/40">
                <th className="py-3 px-2">Order ID</th>
                <th className="py-3 px-2">Customer</th>
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Total</th>
                <th className="py-3 px-2">Order Status</th>
                <th className="py-3 px-2">Shipment</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              {recentFiveOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-2 font-bold text-ink">{order.id}</td>
                  <td className="py-3 px-2">
                    <p className="font-semibold text-ink">{order.customerName}</p>
                    <p className="text-[11px] text-ink/50">{order.customerEmail}</p>
                  </td>
                  <td className="py-3 px-2 text-ink/70">{order.date}</td>
                  <td className="py-3 px-2 font-bold text-ink tabular">${order.total.toFixed(2)}</td>
                  <td className="py-3 px-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        order.orderStatus === "Delivered"
                          ? "bg-emerald-100 text-emerald-800"
                          : order.orderStatus === "Shipped"
                          ? "bg-blue-100 text-blue-800"
                          : order.orderStatus === "Processing"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        order.shipmentStatus === "Delivered"
                          ? "bg-emerald-50 text-emerald-700"
                          : order.shipmentStatus === "Out for Delivery"
                          ? "bg-indigo-50 text-indigo-700"
                          : order.shipmentStatus === "In Transit"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      <Truck size={12} />
                      {order.shipmentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <ActionDropdown
                      id={order.id}
                      idLabel="Order ID"
                      onDelete={() => store.deleteOrder(order.id)}
                      customActions={[
                        {
                          label: "Mark Shipped",
                          icon: <Truck size={14} className="text-blue-500" />,
                          onClick: () => store.updateOrderStatus(order.id, "Shipped"),
                        },
                        {
                          label: "Mark Delivered",
                          icon: <CheckCircle2 size={14} className="text-emerald-500" />,
                          onClick: () => store.updateOrderStatus(order.id, "Delivered"),
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

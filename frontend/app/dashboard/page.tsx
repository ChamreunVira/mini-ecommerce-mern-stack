"use client";

import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Package,
  FolderTree,
  Users,
  Tag,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Clock,
  Truck,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import OverviewChart from "@/components/dashboard/OverviewChart";
import ActionDropdown from "@/components/ui/ActionDropdown";
import { store, useOrders, useProducts, useCategories, useUsers } from "@/lib/store";
import { OrderStatus, ShipmentStatus } from "@/types/product";

export default function DashboardOverviewPage() {
  const orders = useOrders();
  const products = useProducts();
  const categories = useCategories();
  const users = useUsers();

  const totalRevenue = orders.reduce(
    (sum, o) => (o.paymentStatus === "Paid" ? sum + o.total : sum),
    0
  );
  const pendingCount = orders.filter((o) => o.orderStatus === "Pending").length;
  const processingCount = orders.filter((o) => o.orderStatus === "Processing").length;
  const lowStockProducts = products.filter((p) => p.quantity > 0 && p.quantity <= 5);
  const outOfStockProducts = products.filter((p) => p.quantity === 0);
  const recentOrders = orders.slice(0, 5);
  const topProducts = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5);

  const statusCounts = {
    Pending: orders.filter((o) => o.orderStatus === "Pending").length,
    Processing: orders.filter((o) => o.orderStatus === "Processing").length,
    Shipped: orders.filter((o) => o.orderStatus === "Shipped").length,
    Delivered: orders.filter((o) => o.orderStatus === "Delivered").length,
    Cancelled: orders.filter((o) => o.orderStatus === "Cancelled").length,
  };

  return (
    <div className="space-y-6">
      {/* Banner Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-slate-900 p-6 text-white shadow-md">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary border border-primary/30">
            <TrendingUp size={13} /> Marlo Store Manager
          </span>
          <h1 className="mt-2 text-2xl font-bold tracking-tight">Overview Dashboard</h1>
          <p className="mt-1 text-xs text-white/60">
            Real-time management for sales, inventory, orders and customers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/products/new"
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary/90 transition-all shadow-sm"
          >
            <PlusCircle size={16} /> Add Product
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink/50">Revenue</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign size={18} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-ink tabular">${totalRevenue.toFixed(2)}</p>
          <p className="mt-1 text-xs font-medium text-emerald-600 flex items-center gap-1">
            <TrendingUp size={12} /> +12.5% from last month
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink/50">Total Orders</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ShoppingBag size={18} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-ink tabular">{orders.length}</p>
          <p className="mt-1 text-xs font-medium text-amber-600 flex items-center gap-1">
            <Clock size={12} /> {pendingCount + processingCount} requiring action
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink/50">Products</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Package size={18} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-ink tabular">{products.length}</p>
          <p className="mt-1 text-xs font-medium text-rose-500 flex items-center gap-1">
            <AlertTriangle size={12} /> {outOfStockProducts.length} out of stock
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink/50">Users</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Users size={18} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-ink tabular">{users.length}</p>
          <p className="mt-1 text-xs font-medium text-ink/40">{categories.length} categories</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-border bg-white p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-ink/40 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { href: "/dashboard/products/new", icon: <PlusCircle size={16} />, color: "bg-slate-900", label: "Add Product" },
            { href: "/dashboard/orders", icon: <ShoppingBag size={16} />, color: "bg-blue-600", label: "View Orders" },
            { href: "/dashboard/categories", icon: <FolderTree size={16} />, color: "bg-purple-600", label: "Categories" },
            { href: "/dashboard/coupons", icon: <Tag size={16} />, color: "bg-amber-600", label: "Coupons" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3 text-xs font-semibold text-ink hover:border-slate-300 hover:bg-white transition-all shadow-xs"
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.color} text-white`}>
                {item.icon}
              </div>
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Chart */}
      <OverviewChart />

      {/* Bottom grid: Order Status + Low Stock + Top Products */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Order Status */}
        <div className="rounded-2xl border border-border bg-white p-5 shadow-xs">
          <h3 className="text-sm font-bold text-ink mb-4">Order Status</h3>
          <div className="space-y-3">
            {(
              [
                { label: "Pending", count: statusCounts.Pending, color: "bg-slate-400" },
                { label: "Processing", count: statusCounts.Processing, color: "bg-amber-400" },
                { label: "Shipped", count: statusCounts.Shipped, color: "bg-blue-400" },
                { label: "Delivered", count: statusCounts.Delivered, color: "bg-emerald-400" },
                { label: "Cancelled", count: statusCounts.Cancelled, color: "bg-rose-400" },
              ] as const
            ).map(({ label, count, color }) => (
              <div key={label} className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${color} shrink-0`} />
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-xs font-medium text-ink/70">{label}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${color} transition-all`}
                        style={{ width: orders.length ? `${(count / orders.length) * 100}%` : "0%" }}
                      />
                    </div>
                    <span className="text-xs font-bold text-ink tabular w-4 text-right">{count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock */}
        <div className="rounded-2xl border border-border bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-ink">Low Stock</h3>
            <Link href="/dashboard/products" className="text-xs text-primary font-semibold hover:underline">
              View all
            </Link>
          </div>
          {lowStockProducts.length === 0 && outOfStockProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <CheckCircle2 size={24} className="mb-2 text-emerald-400" />
              <p className="text-xs font-semibold text-ink/50">All products are well-stocked</p>
            </div>
          ) : (
            <div className="space-y-2">
              {[...outOfStockProducts, ...lowStockProducts].slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center gap-2">
                  <img src={p.image} alt={p.name} className="h-8 w-8 rounded-lg object-cover border border-border" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-ink truncate">{p.name}</p>
                  </div>
                  <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${p.quantity === 0 ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>
                    {p.quantity === 0 ? "Out" : `${p.quantity} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="rounded-2xl border border-border bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-ink">Top Products</h3>
            <Link href="/dashboard/products" className="text-xs text-primary font-semibold hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-ink/30 w-4 shrink-0">#{i + 1}</span>
                <img src={p.image} alt={p.name} className="h-8 w-8 rounded-lg object-cover border border-border" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-ink truncate">{p.name}</p>
                  <p className="text-[10px] text-ink/40">{p.reviewCount} reviews</p>
                </div>
                <span className="text-xs font-bold text-ink tabular">${p.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl border border-border bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <h3 className="text-base font-bold text-ink">Recent Orders</h3>
            <p className="text-xs text-ink/50">Latest customer transactions</p>
          </div>
          <Link href="/dashboard/orders" className="flex items-center gap-1 text-xs font-bold text-primary hover:underline">
            View All <ArrowRight size={14} />
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
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-2 font-bold text-ink">{order.id}</td>
                  <td className="py-3 px-2">
                    <p className="font-semibold text-ink">{order.customerName}</p>
                    <p className="text-[11px] text-ink/50">{order.customerEmail}</p>
                  </td>
                  <td className="py-3 px-2 text-ink/60">{order.date}</td>
                  <td className="py-3 px-2 font-bold text-ink tabular">${order.total.toFixed(2)}</td>
                  <td className="py-3 px-2">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      order.orderStatus === "Delivered" ? "bg-emerald-100 text-emerald-800"
                      : order.orderStatus === "Shipped" ? "bg-blue-100 text-blue-800"
                      : order.orderStatus === "Processing" ? "bg-amber-100 text-amber-800"
                      : order.orderStatus === "Cancelled" ? "bg-rose-100 text-rose-800"
                      : "bg-slate-100 text-slate-700"
                    }`}>
                      {order.orderStatus}
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
                          onClick: () => {
                            store.updateOrderStatus(order.id, "Shipped" as OrderStatus);
                            store.updateShipmentStatus(order.id, "In Transit" as ShipmentStatus);
                          },
                        },
                        {
                          label: "Mark Delivered",
                          icon: <CheckCircle2 size={14} className="text-emerald-500" />,
                          onClick: () => {
                            store.updateOrderStatus(order.id, "Delivered" as OrderStatus);
                            store.updateShipmentStatus(order.id, "Delivered" as ShipmentStatus);
                          },
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

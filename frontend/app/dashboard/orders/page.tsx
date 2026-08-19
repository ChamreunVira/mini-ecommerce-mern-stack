"use client";

import { useState } from "react";
import {
  ShoppingBag,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Copy,
  Trash2,
  Eye,
  XCircle,
  Filter,
} from "lucide-react";
import ActionDropdown from "@/components/ui/ActionDropdown";
import { store, useOrders } from "@/lib/store";
import { Order, OrderStatus, ShipmentStatus } from "@/types/product";

export default function RecentOrdersPage() {
  const orders = useOrders();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.trackingNumber && order.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "All" || order.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Recent Orders</h1>
          <p className="text-xs text-ink/50">
            Manage customer transactions, update order status, track shipments, and process fulfillments.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 sm:flex-row sm:items-center sm:justify-between shadow-xs">
        <div className="flex flex-1 items-center rounded-xl border border-border bg-surface px-3 py-2">
          <Search size={16} className="text-ink/40" />
          <input
            type="search"
            placeholder="Search by Order ID, Customer Name, or Tracking #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ml-2 w-full bg-transparent text-xs outline-none placeholder:text-ink/40"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={15} className="text-ink/50 shrink-0" />
          <div className="flex items-center gap-1 rounded-xl bg-surface p-1 border border-border">
            {["All", "Pending", "Processing", "Shipped", "Delivered"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  statusFilter === status
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "text-ink/60 hover:text-ink"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table Card */}
      <div className="rounded-2xl border border-border bg-white p-5 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-[11px] font-bold uppercase tracking-wider text-ink/40">
                <th className="py-3 px-3">Order ID</th>
                <th className="py-3 px-3">Customer Details</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Total Amount</th>
                <th className="py-3 px-3">Order Status</th>
                <th className="py-3 px-3">Shipment Tracker</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-ink/50">
                    No orders match your filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Order ID */}
                    <td className="py-3.5 px-3">
                      <button
                        onClick={() => store.copyToClipboard(order.id, "Order ID")}
                        className="font-bold text-ink hover:text-primary transition-colors flex items-center gap-1.5"
                      >
                        {order.id}
                        <Copy size={12} className="text-ink/40" />
                      </button>
                    </td>

                    {/* Customer Info */}
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-ink">{order.customerName}</p>
                      <p className="text-[11px] text-ink/50">{order.customerEmail}</p>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-3 text-ink/70">{order.date}</td>

                    {/* Amount & Payment */}
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-ink tabular">${order.total.toFixed(2)}</p>
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {order.paymentMethod} • {order.paymentStatus}
                      </span>
                    </td>

                    {/* Order Status Select */}
                    <td className="py-3.5 px-3">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => store.updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className={`rounded-lg border border-border px-2 py-1 text-xs font-bold shadow-2xs focus:outline-none cursor-pointer ${
                          order.orderStatus === "Delivered"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : order.orderStatus === "Shipped"
                            ? "bg-blue-50 text-blue-800 border-blue-200"
                            : order.orderStatus === "Processing"
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Shipment Status Select */}
                    <td className="py-3.5 px-3">
                      <div className="flex flex-col gap-1">
                        <select
                          value={order.shipmentStatus}
                          onChange={(e) => store.updateShipmentStatus(order.id, e.target.value as ShipmentStatus)}
                          className="rounded-lg border border-border bg-white px-2 py-1 text-xs font-semibold text-ink focus:outline-none cursor-pointer"
                        >
                          <option value="Unfulfilled">Unfulfilled</option>
                          <option value="In Transit">In Transit</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Returned">Returned</option>
                        </select>
                        {order.trackingNumber && (
                          <span className="text-[10px] text-ink/50 font-mono">
                            TRK: {order.trackingNumber}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions ("More Dot" Menu) */}
                    <td className="py-3.5 px-3 text-right">
                      <ActionDropdown
                        id={order.id}
                        idLabel="Order ID"
                        onView={() => setSelectedOrder(order)}
                        onDelete={() => store.deleteOrder(order.id)}
                        customActions={[
                          {
                            label: "Quick Ship",
                            icon: <Truck size={14} className="text-blue-500" />,
                            onClick: () => {
                              store.updateOrderStatus(order.id, "Shipped");
                              store.updateShipmentStatus(order.id, "In Transit");
                            },
                          },
                          {
                            label: "Quick Deliver",
                            icon: <CheckCircle2 size={14} className="text-emerald-500" />,
                            onClick: () => {
                              store.updateOrderStatus(order.id, "Delivered");
                              store.updateShipmentStatus(order.id, "Delivered");
                            },
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-base font-bold text-ink">Order Details — {selectedOrder.id}</h3>
                <p className="text-xs text-ink/50">Placed on {selectedOrder.date}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-ink/40 hover:text-ink font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-ink/50 uppercase tracking-wider text-[10px]">Customer Information</span>
                <p className="font-semibold text-ink text-sm mt-0.5">{selectedOrder.customerName}</p>
                <p className="text-ink/60">{selectedOrder.customerEmail}</p>
                <p className="text-ink/60 mt-1">📍 {selectedOrder.shippingAddress}</p>
              </div>

              <div className="pt-2 border-t border-border">
                <span className="font-bold text-ink/50 uppercase tracking-wider text-[10px]">Purchased Items</span>
                <div className="mt-2 space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-surface p-2.5 rounded-xl border border-border">
                      <div className="flex items-center gap-3">
                        <img src={item.productImage} alt={item.productName} className="h-10 w-10 rounded-lg object-cover" />
                        <div>
                          <p className="font-bold text-ink">{item.productName}</p>
                          <p className="text-[11px] text-ink/50">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <span className="font-bold text-ink tabular">${(item.quantity * item.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border font-bold text-sm">
                <span>Total Amount Paid</span>
                <span className="text-primary tabular">${selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

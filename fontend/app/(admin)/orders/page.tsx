"use client";

import { useAppSelector } from "@/store/store";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import RowActions from "@/components/RowActions";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function OrdersPage() {
  const orders = useAppSelector((state) => state.orders.items);

  return (
    <div>
      <PageHeader title="Orders" subtitle="View and manage customer orders" />

      <div className="overflow-x-auto rounded-2xl border border-gray-200">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="border-b border-gray-200 text-sm text-gray-500">
              <th className="py-4 pl-5 font-semibold text-ink">Order</th>
              <th className="py-4 pr-4 font-semibold text-ink">Customer</th>
              <th className="py-4 pr-4 font-semibold text-ink">Total</th>
              <th className="py-4 pr-4 font-semibold text-ink">Status</th>
              <th className="py-4 pr-4 font-semibold text-ink">Payment</th>
              <th className="py-4 pr-4 font-semibold text-ink">Date</th>
              <th className="py-4 pr-5 font-semibold text-ink">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-gray-100 last:border-0 text-sm">
                <td className="py-4 pl-5 font-medium text-ink">{o.orderNumber}</td>
                <td className="py-4 pr-4 text-ink">{o.customer}</td>
                <td className="py-4 pr-4 text-ink">${o.total.toFixed(2)}</td>
                <td className="py-4 pr-4">
                  <StatusBadge status={o.status} />
                </td>
                <td className="py-4 pr-4">
                  <StatusBadge status={o.paymentStatus} />
                </td>
                <td className="py-4 pr-4 text-ink">{formatDate(o.createdAt)}</td>
                <td className="py-4 pr-5">
                  <RowActions onView={() => {}} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

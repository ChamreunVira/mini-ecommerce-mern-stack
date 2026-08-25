"use client";

import { useAppSelector } from "@/store/store";
import { ChevronLeft, ChevronRight, Ticket } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import PrimaryButton from "@/components/PrimaryButton";
import StatusBadge from "@/components/StatusBadge";
import RowActions from "@/components/RowActions";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function CouponsPage() {
  const coupons = useAppSelector((state) => state.coupons.items);

  return (
    <div>
      <PageHeader
        title="Coupons"
        subtitle="Manage coupons in the store"
        action={<PrimaryButton>Create Coupon</PrimaryButton>}
      />

      <div className="overflow-x-auto rounded-2xl border border-gray-200">
        <table className="w-full min-w-[820px] text-left">
          <thead>
            <tr className="border-b border-gray-200 text-sm text-gray-500">
              <th className="w-10 py-4 pl-5">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
              </th>
              <th className="py-4 pr-4 font-semibold text-ink">Code</th>
              <th className="py-4 pr-4 font-semibold text-ink">Discount</th>
              <th className="py-4 pr-4 font-semibold text-ink">Total Uses</th>
              <th className="py-4 pr-4 font-semibold text-ink">Max Uses</th>
              <th className="py-4 pr-4 font-semibold text-ink">Expiry Date</th>
              <th className="py-4 pr-4 font-semibold text-ink">Status</th>
              <th className="py-4 pr-5 font-semibold text-ink">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-b border-gray-100 last:border-0 text-sm">
                <td className="py-4 pl-5">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                </td>
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-600 text-white">
                      <Ticket size={13} />
                    </span>
                    <span className="font-medium text-ink">{c.code}</span>
                  </div>
                </td>
                <td className="py-4 pr-4 text-ink">
                  {c.discountType === "percentage" ? `${c.discount}%` : `$${c.discount}`}
                </td>
                <td className="py-4 pr-4 text-ink">{c.totalUses}</td>
                <td className="py-4 pr-4 text-ink">{c.maxUses}</td>
                <td className="py-4 pr-4 text-ink">{formatDate(c.expiryDate)}</td>
                <td className="py-4 pr-4">
                  <StatusBadge status={c.status} />
                </td>
                <td className="py-4 pr-5">
                  <RowActions onEdit={() => {}} onDelete={() => {}} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50/60 px-5 py-3.5 text-sm text-gray-500">
          <span>
            Showing <span className="font-semibold text-ink">1</span> to{" "}
            <span className="font-semibold text-ink">{coupons.length}</span> of{" "}
            <span className="font-semibold text-ink">{coupons.length}</span> results
          </span>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-gray-400" disabled>
              <ChevronLeft size={16} /> Previous
            </button>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white border border-gray-200 font-medium text-ink">
              1
            </span>
            <button className="flex items-center gap-1 text-ink font-medium">
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

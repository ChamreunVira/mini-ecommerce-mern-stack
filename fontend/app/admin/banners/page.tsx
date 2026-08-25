"use client";

import { useAppSelector } from "@/store/store";
import PageHeader from "@/components/PageHeader";
import PrimaryButton from "@/components/PrimaryButton";
import ImageThumb from "@/components/ImageThumb";
import StatusBadge from "@/components/StatusBadge";
import RowActions from "@/components/RowActions";

export default function BannersPage() {
  const banners = useAppSelector((state) => state.banners.items);

  return (
    <div>
      <PageHeader
        title="Hero Banners"
        subtitle="Manage homepage carousel banners"
        action={<PrimaryButton>Create Banner</PrimaryButton>}
      />

      <div className="overflow-x-auto rounded-2xl border border-gray-200">
        <table className="w-full min-w-[760px] text-left">
          <thead>
            <tr className="border-b border-gray-200 text-sm text-gray-500">
              <th className="py-4 pl-5 font-semibold text-ink">Image</th>
              <th className="py-4 pr-4 font-semibold text-ink">Title</th>
              <th className="py-4 pr-4 font-semibold text-ink">Order</th>
              <th className="py-4 pr-4 font-semibold text-ink">Status</th>
              <th className="py-4 pr-5 font-semibold text-ink">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((b) => (
              <tr key={b.id} className="border-b border-gray-100 last:border-0 text-sm">
                <td className="py-4 pl-5">
                  <ImageThumb color={b.imageColor} size={48} rounded="rounded-lg" />
                </td>
                <td className="py-4 pr-4">
                  <p className="font-semibold text-ink">{b.title}</p>
                  {b.description && (
                    <p className="text-gray-500 text-[13px]">{b.description}</p>
                  )}
                </td>
                <td className="py-4 pr-4">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-ink">
                    {b.order}
                  </span>
                </td>
                <td className="py-4 pr-4">
                  <StatusBadge status={b.status} />
                </td>
                <td className="py-4 pr-5">
                  <RowActions onEdit={() => {}} onDelete={() => {}} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

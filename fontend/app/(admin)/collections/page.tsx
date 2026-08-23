"use client";

import PageHeader from "@/components/PageHeader";
import PrimaryButton from "@/components/PrimaryButton";
import ImageThumb from "@/components/ImageThumb";
import StatusBadge from "@/components/StatusBadge";
import RowActions from "@/components/RowActions";

interface CollectionItem {
  id: string;
  name: string;
  products: number;
  status: string;
  color: string;
}

const COLLECTIONS: CollectionItem[] = [
  { id: "col1", name: "Childhood Nostalgia", products: 3, status: "Active", color: "#374151" },
  { id: "col2", name: "Tourist Vs Purist", products: 3, status: "Active", color: "#78350f" },
  { id: "col3", name: "Kdmv X Tena", products: 1, status: "Active", color: "#1f2937" },
];

export default function CollectionsPage() {
  return (
    <div>
      <PageHeader
        title="Collections"
        subtitle="Manage product collections in the store"
        action={<PrimaryButton>Create Collection</PrimaryButton>}
      />

      <div className="overflow-x-auto rounded-2xl border border-gray-200">
        <table className="w-full min-w-[700px] text-left">
          <thead>
            <tr className="border-b border-gray-200 text-sm text-gray-500">
              <th className="py-4 pl-5 font-semibold text-ink">Image</th>
              <th className="py-4 pr-4 font-semibold text-ink">Name</th>
              <th className="py-4 pr-4 font-semibold text-ink">Products</th>
              <th className="py-4 pr-4 font-semibold text-ink">Status</th>
              <th className="py-4 pr-5 font-semibold text-ink">Actions</th>
            </tr>
          </thead>
          <tbody>
            {COLLECTIONS.map((c) => (
              <tr key={c.id} className="border-b border-gray-100 last:border-0 text-sm">
                <td className="py-4 pl-5">
                  <ImageThumb color={c.color} />
                </td>
                <td className="py-4 pr-4 font-medium text-ink">{c.name}</td>
                <td className="py-4 pr-4 text-ink">{c.products}</td>
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
      </div>
    </div>
  );
}

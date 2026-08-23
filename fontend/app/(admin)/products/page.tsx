"use client";

import { useAppSelector } from "@/store/store";
import PageHeader from "@/components/PageHeader";
import PrimaryButton from "@/components/PrimaryButton";
import ImageThumb from "@/components/ImageThumb";
import StatusBadge from "@/components/StatusBadge";
import RowActions from "@/components/RowActions";

export default function ProductsPage() {
  const products = useAppSelector((state) => state.products.items);

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle="Manage products in the store"
        action={<PrimaryButton>Add Product</PrimaryButton>}
      />

      <div className="overflow-x-auto rounded-2xl border border-gray-200">
        <table className="w-full min-w-[980px] text-left">
          <thead>
            <tr className="border-b border-gray-200 text-sm text-gray-500">
              <th className="w-10 py-4 pl-5">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
              </th>
              <th className="py-4 pr-4 font-semibold text-ink">Product Name</th>
              <th className="py-4 pr-4 font-semibold text-ink">Base Price</th>
              <th className="py-4 pr-4 font-semibold text-ink">Discount</th>
              <th className="py-4 pr-4 font-semibold text-ink">Category</th>
              <th className="py-4 pr-4 font-semibold text-ink">Collection</th>
              <th className="py-4 pr-4 font-semibold text-ink">Stock</th>
              <th className="py-4 pr-4 font-semibold text-ink">Code</th>
              <th className="py-4 pr-4 font-semibold text-ink">Status</th>
              <th className="py-4 pr-5 font-semibold text-ink">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const deleted = p.status === "Deleted";
              const rowClass = deleted ? "text-red-300 line-through" : "text-ink";
              return (
                <tr key={p.id} className="border-b border-gray-100 last:border-0 text-sm">
                  <td className="py-4 pl-5">
                    <input
                      type="checkbox"
                      disabled={deleted}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className={deleted ? "opacity-40" : ""}>
                        <ImageThumb color={p.imageColor} />
                      </div>
                      <span className={`font-medium ${rowClass}`}>{p.name}</span>
                    </div>
                  </td>
                  <td className={`py-4 pr-4 ${rowClass}`}>${p.basePrice.toFixed(2)}</td>
                  <td className={`py-4 pr-4 ${rowClass}`}>
                    {p.discount ? `${p.discount}%` : "No Discount"}
                  </td>
                  <td className={`py-4 pr-4 ${rowClass}`}>{p.category}</td>
                  <td className={`py-4 pr-4 ${rowClass}`}>{p.collection}</td>
                  <td className={`py-4 pr-4 ${rowClass}`}>{p.stock}</td>
                  <td className={`py-4 pr-4 ${rowClass}`}>{p.code}</td>
                  <td className="py-4 pr-4">
                    {deleted ? (
                      <span className="text-red-400 line-through text-xs font-medium">
                        Deleted
                      </span>
                    ) : (
                      <StatusBadge status={p.status} />
                    )}
                  </td>
                  <td className="py-4 pr-5">
                    <RowActions
                      disabled={deleted}
                      onEdit={() => {}}
                      onDelete={() => {}}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { removeProduct } from "@/store/slices/productsSlice";
import PageHeader from "@/components/PageHeader";
import PrimaryButton from "@/components/PrimaryButton";
import ImageThumb from "@/components/ImageThumb";
import StatusBadge from "@/components/StatusBadge";
import RowActions from "@/components/RowActions";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Product } from "@/types";

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.items);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  function handleDeleteConfirm() {
    if (productToDelete) {
      dispatch(removeProduct(productToDelete.id));
      setProductToDelete(null);
    }
  }

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle="Manage products in the store"
        action={
          <Link href="/products/new">
            <PrimaryButton>Add Product</PrimaryButton>
          </Link>
        }
      />

      <div className="overflow-x-auto rounded-2xl border border-gray-200">
        <table className="w-full min-w-[840px] text-left">
          <thead>
            <tr className="border-b border-gray-200 text-sm text-gray-500">
              <th className="w-10 py-4 pl-5">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
              </th>
              <th className="py-4 pr-4 font-semibold text-ink">Product Name</th>
              <th className="py-4 pr-4 font-semibold text-ink">Price</th>
              <th className="py-4 pr-4 font-semibold text-ink">Discount</th>
              <th className="py-4 pr-4 font-semibold text-ink">Category</th>
              <th className="py-4 pr-4 font-semibold text-ink">Variants</th>
              <th className="py-4 pr-4 font-semibold text-ink">Quantity</th>
              <th className="py-4 pr-4 font-semibold text-ink">Status</th>
              <th className="py-4 pr-5 font-semibold text-ink">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const deleted = p.status === "Deleted";
              const rowClass = deleted ? "text-red-300 line-through" : "text-ink";
              const variantCount = p.variants?.length ?? 0;

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
                      <div>
                        <p className={`font-medium ${rowClass}`}>{p.name}</p>
                        {p.description && (
                          <p className="text-xs text-gray-400 line-clamp-1 max-w-[240px]">
                            {p.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className={`py-4 pr-4 ${rowClass}`}>${p.price.toFixed(2)}</td>
                  <td className={`py-4 pr-4 ${rowClass}`}>
                    {p.discount ? `${p.discount}%` : "No Discount"}
                  </td>
                  <td className={`py-4 pr-4 ${rowClass}`}>{p.category}</td>
                  <td className={`py-4 pr-4 ${rowClass}`}>
                    {variantCount > 0 ? (
                      <span className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                        {variantCount} variant{variantCount > 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">None</span>
                    )}
                  </td>
                  <td className={`py-4 pr-4 ${rowClass}`}>{p.quantity}</td>
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
                      onDelete={() => setProductToDelete(p)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!productToDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action will mark the product as deleted.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setProductToDelete(null)}
      />
    </div>
  );
}

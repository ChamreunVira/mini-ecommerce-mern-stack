"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Package,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { store, useProducts, useCategories } from "@/lib/store";
import { AdminProduct } from "@/types/product";
import ActionDropdown from "@/components/ui/ActionDropdown";

const PAGE_SIZE = 8;

function StatusBadge({ status }: { status: "active" | "inactive" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
        status === "active"
          ? "bg-emerald-100 text-emerald-700"
          : "bg-slate-100 text-slate-500"
      }`}
    >
      {status}
    </span>
  );
}

function StockBadge({ inStock, quantity }: { inStock: boolean; quantity: number }) {
  if (quantity === 0 || !inStock)
    return (
      <span className="inline-flex items-center rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
        Out of stock
      </span>
    );
  if (quantity <= 5)
    return (
      <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
        Low ({quantity})
      </span>
    );
  return (
    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
      {quantity}
    </span>
  );
}

export default function ProductsPage() {
  const allProducts = useProducts();
  const allCategories = useCategories();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);

  const filtered = useMemo(() => {
    return allProducts.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
      const matchCat = categoryFilter === "all" || p.category === categoryFilter;
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      return matchSearch && matchCat && matchStatus;
    });
  }, [allProducts, search, categoryFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const resetPage = () => setPage(1);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Products</h1>
          <p className="text-xs text-ink/50">{allProducts.length} products total</p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-sm"
        >
          <Plus size={15} />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 shadow-xs sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2">
          <Search size={15} className="shrink-0 text-ink/40" />
          <input
            type="search"
            placeholder="Search by name or ID…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); resetPage(); }}
            className="w-full bg-transparent text-xs outline-none placeholder:text-ink/40"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); resetPage(); }}
            className="rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-ink focus:outline-none"
          >
            <option value="all">All Categories</option>
            {allCategories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>

          <div className="flex items-center gap-0.5 rounded-xl border border-border bg-surface p-1">
            {["all", "active", "inactive"].map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); resetPage(); }}
                className={`rounded-lg px-3 py-1 text-xs font-semibold capitalize transition-all ${
                  statusFilter === s ? "bg-white text-ink shadow-xs" : "text-ink/50 hover:text-ink"
                }`}
              >
                {s === "all" ? "All" : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-surface/60 text-[11px] font-bold uppercase tracking-wider text-ink/40">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Variants</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <Package size={32} className="mx-auto mb-2 text-ink/20" />
                    <p className="text-sm font-semibold text-ink/40">No products found</p>
                    <p className="text-xs text-ink/30">Try adjusting your filters</p>
                  </td>
                </tr>
              ) : (
                pageItems.map((p) => (
                  <tr key={p.id} className="hover:bg-surface/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-10 w-10 rounded-xl object-cover border border-border"
                        />
                        <div>
                          <p className="font-semibold text-ink leading-snug">{p.name}</p>
                          <p className="text-[10px] text-ink/40 font-mono">{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 capitalize text-ink/70">{p.category}</td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-ink tabular">${p.price.toFixed(2)}</p>
                      {p.discount > 0 && (
                        <p className="text-[10px] text-emerald-600 font-semibold">{p.discount}% off</p>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <StockBadge inStock={p.inStock} quantity={p.quantity} />
                    </td>
                    <td className="py-3 px-4 text-ink/60">
                      {p.variants.length > 0 ? (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                          {p.variants.length} variants
                        </span>
                      ) : (
                        <span className="text-ink/30">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="py-3 px-4 text-ink/50">{p.createdAt}</td>
                    <td className="py-3 px-4 text-right">
                      <ActionDropdown
                        id={p.id}
                        idLabel="Product ID"
                        onEdit={() => window.location.href = `/dashboard/products/${p.id}/edit`}
                        onDelete={() => setDeleteTarget(p)}
                        customActions={[
                          {
                            label: p.status === "active" ? "Deactivate" : "Activate",
                            icon: p.status === "active" ? <ToggleLeft size={14} className="text-amber-500" /> : <ToggleRight size={14} className="text-emerald-500" />,
                            onClick: () => store.toggleProductStatus(p.id),
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-xs text-ink/50">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-ink/60 hover:bg-surface disabled:opacity-30"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                    n === page ? "bg-slate-900 text-white" : "border border-border text-ink/60 hover:bg-surface"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-ink/60 hover:bg-surface disabled:opacity-30"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirm dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                <Trash2 size={18} />
              </div>
              <div>
                <h3 className="font-bold text-ink text-sm">Delete Product</h3>
                <p className="text-xs text-ink/50">This cannot be undone.</p>
              </div>
            </div>
            <p className="text-xs text-ink/70 mb-5">
              Are you sure you want to delete <span className="font-bold text-ink">"{deleteTarget.name}"</span>?
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-ink/70 hover:bg-surface"
              >
                Cancel
              </button>
              <button
                onClick={() => { store.deleteProduct(deleteTarget.id); setDeleteTarget(null); }}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

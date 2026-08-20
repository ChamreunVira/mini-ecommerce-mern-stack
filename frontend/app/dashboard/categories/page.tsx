"use client";

import { useState, useMemo } from "react";
import { Plus, Trash2, Edit2, FolderTree, ToggleLeft, ToggleRight, X } from "lucide-react";
import { store, useCategories } from "@/lib/store";
import { Category } from "@/types/product";

function StatusBadge({ status }: { status?: string }) {
  const s = status ?? "active";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${s === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
      {s}
    </span>
  );
}

const emptyForm = { name: "", slug: "", image: "", description: "", status: "active" as "active" | "inactive" };

export default function CategoriesPage() {
  const categories = useCategories();
  const [modal, setModal] = useState<null | "create" | Category>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const isEditing = modal !== null && modal !== "create";

  const openCreate = () => {
    setForm(emptyForm);
    setErrors({});
    setModal("create");
  };

  const openEdit = (cat: Category) => {
    setForm({
      name: cat.name,
      slug: cat.slug,
      image: cat.image ?? "",
      description: cat.description ?? "",
      status: cat.status ?? "active",
    });
    setErrors({});
    setModal(cat);
  };

  const set = (field: string, value: string) => {
    setForm((f) => {
      const next = { ...f, [field]: value };
      if (field === "name" && !isEditing) {
        next.slug = value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      }
      return next;
    });
    setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.slug.trim()) e.slug = "Slug is required";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 350));
    if (isEditing) {
      store.updateCategory((modal as Category).id, {
        name: form.name.trim(),
        slug: form.slug.trim(),
        image: form.image.trim() || "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=300&h=300&fit=crop",
        description: form.description.trim(),
        status: form.status,
      });
    } else {
      store.addCategory({
        name: form.name.trim(),
        slug: form.slug.trim(),
        image: form.image.trim() || "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=300&h=300&fit=crop",
        description: form.description.trim(),
        status: form.status,
        productCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
      });
    }
    setSaving(false);
    setModal(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Categories</h1>
          <p className="text-xs text-ink/50">{categories.length} categories</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 shadow-sm"
        >
          <Plus size={15} /> Add Category
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-surface/60 text-[11px] font-bold uppercase tracking-wider text-ink/40">
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Products</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <FolderTree size={32} className="mx-auto mb-2 text-ink/20" />
                    <p className="text-sm font-semibold text-ink/40">No categories yet</p>
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-surface/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={cat.image} alt={cat.name} className="h-10 w-10 rounded-xl object-cover border border-border" />
                        <div>
                          <p className="font-semibold text-ink">{cat.name}</p>
                          <p className="text-[10px] text-ink/40 font-mono">{cat.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-ink/60 max-w-[200px] truncate">{cat.description ?? "—"}</td>
                    <td className="py-3 px-4 font-semibold text-ink">{cat.productCount ?? 0}</td>
                    <td className="py-3 px-4"><StatusBadge status={cat.status} /></td>
                    <td className="py-3 px-4 text-ink/50">{cat.createdAt ?? "—"}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => store.toggleCategoryStatus(cat.id)}
                          title={cat.status === "active" ? "Deactivate" : "Activate"}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-ink/50 hover:bg-surface"
                        >
                          {cat.status === "active" ? <ToggleRight size={16} className="text-emerald-500" /> : <ToggleLeft size={16} className="text-slate-400" />}
                        </button>
                        <button
                          onClick={() => openEdit(cat)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-ink/50 hover:bg-surface"
                        >
                          <Edit2 size={14} className="text-amber-500" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(cat)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-ink/50 hover:bg-rose-50"
                        >
                          <Trash2 size={14} className="text-rose-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-ink">{isEditing ? "Edit Category" : "New Category"}</h3>
              <button onClick={() => setModal(null)} className="text-ink/40 hover:text-ink"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Name</label>
                <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Men's Clothing" className="input" />
                {errors.name && <p className="field-error">{errors.name}</p>}
              </div>
              <div>
                <label className="label">Slug</label>
                <input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="mens-clothing" className="input" />
                {errors.slug && <p className="field-error">{errors.slug}</p>}
              </div>
              <div>
                <label className="label">Description</label>
                <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={2} className="input" />
              </div>
              <div>
                <label className="label">Image URL</label>
                <input value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://…" className="input" />
              </div>
              <div>
                <label className="label">Status</label>
                <div className="flex gap-2">
                  {(["active", "inactive"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, status: s }))}
                      className={`rounded-xl px-4 py-2 text-xs font-bold capitalize transition-all ${form.status === s ? "bg-slate-900 text-white" : "border border-border text-ink/60 hover:bg-surface"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModal(null)} className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-ink/70 hover:bg-surface">Cancel</button>
                <button type="submit" disabled={saving} className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-60">
                  {saving ? "Saving…" : isEditing ? "Save Changes" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Soft-delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <ToggleLeft size={18} />
              </div>
              <div>
                <h3 className="font-bold text-ink text-sm">Deactivate Category</h3>
                <p className="text-xs text-ink/50">Soft delete — stays in database</p>
              </div>
            </div>
            <p className="text-xs text-ink/70 mb-5">
              Deactivate <span className="font-bold text-ink">"{deleteTarget.name}"</span>? Its status will be set to inactive.
            </p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteTarget(null)} className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-ink/70 hover:bg-surface">Cancel</button>
              <button
                onClick={() => { store.softDeleteCategory(deleteTarget.id); setDeleteTarget(null); }}
                className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white hover:bg-amber-600"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .label { display: block; margin-bottom: 4px; font-size: 11px; font-weight: 700; color: rgba(20,33,61,0.5); text-transform: uppercase; letter-spacing: 0.05em; }
        .input { width: 100%; border-radius: 10px; border: 1px solid #E3E7F0; background: #F5F7FB; padding: 8px 10px; font-size: 12px; color: #14213D; outline: none; }
        .input:focus { border-color: #2F5FF6; background: white; }
        .field-error { margin-top: 3px; font-size: 10px; color: #D64545; font-weight: 600; }
      `}</style>
    </div>
  );
}

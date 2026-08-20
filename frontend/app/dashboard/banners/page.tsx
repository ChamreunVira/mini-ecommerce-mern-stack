"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Image as ImageIcon, ToggleLeft, ToggleRight, X, ExternalLink } from "lucide-react";
import { store, useBanners } from "@/lib/store";
import type { Banner } from "@/types/product";

function StatusBadge({ status }: { status: "active" | "inactive" }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
      {status}
    </span>
  );
}

const emptyForm = { title: "", description: "", image: "", link: "", status: "active" as "active" | "inactive" };

export default function BannersPage() {
  const banners = useBanners();
  const [modal, setModal] = useState<null | "create" | Banner>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null);

  const isEditing = modal !== null && modal !== "create";

  const openCreate = () => { setForm(emptyForm); setErrors({}); setModal("create"); };
  const openEdit = (b: Banner) => {
    setForm({ title: b.title, description: b.description, image: b.image, link: b.link, status: b.status });
    setErrors({});
    setModal(b);
  };

  const set = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.image.trim()) e.image = "Image URL is required";
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 350));
    const data = { title: form.title.trim(), description: form.description.trim(), image: form.image.trim(), link: form.link.trim(), status: form.status };
    if (isEditing) {
      store.updateBanner((modal as Banner).id, data);
    } else {
      store.addBanner(data);
    }
    setSaving(false);
    setModal(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Banners</h1>
          <p className="text-xs text-ink/50">{banners.length} banners total</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 shadow-sm"
        >
          <Plus size={15} /> Add Banner
        </button>
      </div>

      {/* Banner cards */}
      {banners.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-20">
          <ImageIcon size={36} className="mb-3 text-ink/20" />
          <p className="text-sm font-semibold text-ink/40">No banners yet</p>
          <p className="text-xs text-ink/30">Click "Add Banner" to create one</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {banners.map((b) => (
            <div key={b.id} className="rounded-2xl border border-border bg-white shadow-xs overflow-hidden">
              <div className="relative h-36 w-full bg-surface">
                <img src={b.image} alt={b.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <StatusBadge status={b.status} />
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-bold text-ink text-sm leading-snug truncate">{b.title}</h3>
                    <p className="text-xs text-ink/50 mt-0.5 line-clamp-2">{b.description || "No description"}</p>
                    {b.link && (
                      <p className="mt-1 flex items-center gap-1 text-[10px] text-primary font-semibold truncate">
                        <ExternalLink size={10} /> {b.link}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => store.toggleBannerStatus(b.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-ink/50 hover:bg-surface"
                    >
                      {b.status === "active" ? <ToggleRight size={16} className="text-emerald-500" /> : <ToggleLeft size={16} className="text-slate-400" />}
                    </button>
                    <button
                      onClick={() => openEdit(b)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-ink/50 hover:bg-surface"
                    >
                      <Edit2 size={14} className="text-amber-500" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(b)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-ink/50 hover:bg-rose-50"
                    >
                      <Trash2 size={14} className="text-rose-400" />
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-[10px] text-ink/30">Created {b.createdAt}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-ink">{isEditing ? "Edit Banner" : "New Banner"}</h3>
              <button onClick={() => setModal(null)} className="text-ink/40 hover:text-ink"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Title</label>
                <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Summer Sale — Up to 40% Off" className="input" />
                {errors.title && <p className="field-error">{errors.title}</p>}
              </div>
              <div>
                <label className="label">Description</label>
                <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={2} placeholder="Short description…" className="input" />
              </div>
              <div>
                <label className="label">Image URL</label>
                <input value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://…" className="input" />
                {errors.image && <p className="field-error">{errors.image}</p>}
                {form.image && (
                  <img src={form.image} alt="" className="mt-2 h-20 w-full rounded-xl object-cover border border-border" />
                )}
              </div>
              <div>
                <label className="label">Link URL</label>
                <input value={form.link} onChange={(e) => set("link", e.target.value)} placeholder="/category/men" className="input" />
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

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="font-bold text-ink mb-2">Delete Banner</h3>
            <p className="text-xs text-ink/70 mb-5">
              Delete <span className="font-bold text-ink">"{deleteTarget.title}"</span>? This cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteTarget(null)} className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-ink/70 hover:bg-surface">Cancel</button>
              <button
                onClick={() => { store.deleteBanner(deleteTarget.id); setDeleteTarget(null); }}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700"
              >
                Delete
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

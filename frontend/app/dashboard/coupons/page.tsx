"use client";

import { useState, useMemo } from "react";
import { Plus, Trash2, Edit2, Tag, ToggleLeft, ToggleRight, X } from "lucide-react";
import { store, useCoupons } from "@/lib/store";
import type { Coupon } from "@/types/product";

function StatusBadge({ status }: { status: "active" | "inactive" }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
      {status}
    </span>
  );
}

const emptyForm = {
  code: "",
  discount: "",
  type: "percentage" as "percentage" | "fixed",
  usageLimit: "100",
  expiresAt: "",
  status: "active" as "active" | "inactive",
};

export default function CouponsPage() {
  const coupons = useCoupons();
  const [modal, setModal] = useState<null | "create" | Coupon>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);

  const isEditing = modal !== null && modal !== "create";

  const openCreate = () => { setForm(emptyForm); setErrors({}); setModal("create"); };
  const openEdit = (c: Coupon) => {
    setForm({
      code: c.code,
      discount: String(c.discount),
      type: c.type,
      usageLimit: String(c.usageLimit),
      expiresAt: c.expiresAt,
      status: c.status,
    });
    setErrors({});
    setModal(c);
  };

  const set = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.code.trim()) e.code = "Code is required";
    if (!form.discount || isNaN(Number(form.discount)) || Number(form.discount) <= 0)
      e.discount = "Valid discount required";
    if (!form.expiresAt) e.expiresAt = "Expiry date required";
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 350));
    const data = {
      code: form.code.trim().toUpperCase(),
      discount: Number(form.discount),
      type: form.type,
      usageLimit: Number(form.usageLimit) || 100,
      expiresAt: form.expiresAt,
      status: form.status,
    };
    if (isEditing) {
      store.updateCoupon((modal as Coupon).id, data);
    } else {
      store.addCoupon(data);
    }
    setSaving(false);
    setModal(null);
  };

  const usagePercent = (c: Coupon) =>
    c.usageLimit > 0 ? Math.round((c.usedCount / c.usageLimit) * 100) : 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Coupons</h1>
          <p className="text-xs text-ink/50">{coupons.length} coupons total</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 shadow-sm"
        >
          <Plus size={15} /> Add Coupon
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-surface/60 text-[11px] font-bold uppercase tracking-wider text-ink/40">
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Usage</th>
                <th className="py-3 px-4">Expires</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <Tag size={32} className="mx-auto mb-2 text-ink/20" />
                    <p className="text-sm font-semibold text-ink/40">No coupons yet</p>
                  </td>
                </tr>
              ) : (
                coupons.map((c) => {
                  const pct = usagePercent(c);
                  return (
                    <tr key={c.id} className="hover:bg-surface/40 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-ink bg-surface border border-border rounded-lg px-2 py-1 text-xs">
                          {c.code}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-ink">
                        {c.type === "percentage" ? `${c.discount}%` : `$${c.discount.toFixed(2)}`}
                        <p className="text-[10px] text-ink/40 font-normal capitalize">{c.type}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-ink/60 tabular">{c.usedCount}/{c.usageLimit}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-ink/60">{c.expiresAt}</td>
                      <td className="py-3 px-4"><StatusBadge status={c.status} /></td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => store.toggleCouponStatus(c.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-ink/50 hover:bg-surface"
                          >
                            {c.status === "active" ? <ToggleRight size={16} className="text-emerald-500" /> : <ToggleLeft size={16} className="text-slate-400" />}
                          </button>
                          <button
                            onClick={() => openEdit(c)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-ink/50 hover:bg-surface"
                          >
                            <Edit2 size={14} className="text-amber-500" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(c)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-ink/50 hover:bg-rose-50"
                          >
                            <Trash2 size={14} className="text-rose-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-ink">{isEditing ? "Edit Coupon" : "New Coupon"}</h3>
              <button onClick={() => setModal(null)} className="text-ink/40 hover:text-ink"><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Coupon Code</label>
                <input
                  value={form.code}
                  onChange={(e) => set("code", e.target.value)}
                  placeholder="SUMMER20"
                  className="input uppercase"
                />
                {errors.code && <p className="field-error">{errors.code}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Discount</label>
                  <input type="number" min="0" step="0.01" value={form.discount} onChange={(e) => set("discount", e.target.value)} placeholder="20" className="input" />
                  {errors.discount && <p className="field-error">{errors.discount}</p>}
                </div>
                <div>
                  <label className="label">Type</label>
                  <div className="flex gap-1 mt-0.5">
                    {(["percentage", "fixed"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, type: t }))}
                        className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${form.type === t ? "bg-slate-900 text-white" : "border border-border text-ink/60 hover:bg-surface"}`}
                      >
                        {t === "percentage" ? "%" : "$"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Usage Limit</label>
                  <input type="number" min="1" value={form.usageLimit} onChange={(e) => set("usageLimit", e.target.value)} className="input" />
                </div>
                <div>
                  <label className="label">Expires At</label>
                  <input type="date" value={form.expiresAt} onChange={(e) => set("expiresAt", e.target.value)} className="input" />
                  {errors.expiresAt && <p className="field-error">{errors.expiresAt}</p>}
                </div>
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
            <h3 className="font-bold text-ink mb-2">Delete Coupon</h3>
            <p className="text-xs text-ink/70 mb-5">
              Delete coupon <span className="font-mono font-bold text-ink">{deleteTarget.code}</span>? This cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteTarget(null)} className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-ink/70 hover:bg-surface">Cancel</button>
              <button
                onClick={() => { store.deleteCoupon(deleteTarget.id); setDeleteTarget(null); }}
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

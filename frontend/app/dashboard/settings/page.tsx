"use client";

import { useState } from "react";
import { Save, CheckCircle2, Store, Phone, Mail, DollarSign, Truck, Percent } from "lucide-react";
import { store, useAppSettings } from "@/lib/store";

export default function SettingsPage() {
  const settings = useAppSettings();
  const [form, setForm] = useState({ ...settings });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (field: string, value: string | number) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    store.saveSettings(form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-ink">Settings</h1>
        <p className="text-xs text-ink/50">Configure your store information and preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Store Information */}
        <div className="rounded-2xl border border-border bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <Store size={16} />
            </div>
            <h2 className="text-sm font-bold text-ink">Store Information</h2>
          </div>

          <div>
            <label className="label">Store Name</label>
            <input
              value={form.storeName}
              onChange={(e) => set("storeName", e.target.value)}
              placeholder="Marlo Marketplace"
              className="input"
            />
          </div>

          <div>
            <label className="label">Store Description</label>
            <textarea
              value={form.storeDescription}
              onChange={(e) => set("storeDescription", e.target.value)}
              rows={3}
              placeholder="A brief description of your store…"
              className="input"
            />
          </div>

          <div>
            <label className="label">Store Logo URL</label>
            <input
              value={form.storeLogo}
              onChange={(e) => set("storeLogo", e.target.value)}
              placeholder="https://…"
              className="input"
            />
            {form.storeLogo && (
              <img src={form.storeLogo} alt="Logo preview" className="mt-2 h-12 w-12 rounded-xl object-contain border border-border bg-surface p-1" />
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">
                <span className="flex items-center gap-1"><Mail size={10} /> Contact Email</span>
              </label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={(e) => set("contactEmail", e.target.value)}
                placeholder="support@store.com"
                className="input"
              />
            </div>
            <div>
              <label className="label">
                <span className="flex items-center gap-1"><Phone size={10} /> Contact Phone</span>
              </label>
              <input
                value={form.contactPhone}
                onChange={(e) => set("contactPhone", e.target.value)}
                placeholder="+1 555 000 0000"
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Store Configuration */}
        <div className="rounded-2xl border border-border bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <DollarSign size={16} />
            </div>
            <h2 className="text-sm font-bold text-ink">Store Configuration</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="label">
                <span className="flex items-center gap-1"><DollarSign size={10} /> Currency</span>
              </label>
              <select
                value={form.currency}
                onChange={(e) => set("currency", e.target.value)}
                className="input"
              >
                <option value="USD">USD — US Dollar</option>
                <option value="EUR">EUR — Euro</option>
                <option value="KHR">KHR — Cambodian Riel</option>
                <option value="THB">THB — Thai Baht</option>
                <option value="SGD">SGD — Singapore Dollar</option>
              </select>
            </div>
            <div>
              <label className="label">
                <span className="flex items-center gap-1"><Truck size={10} /> Shipping Fee</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-ink/40">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.shippingFee}
                  onChange={(e) => set("shippingFee", Number(e.target.value))}
                  className="input pl-6"
                />
              </div>
            </div>
            <div>
              <label className="label">
                <span className="flex items-center gap-1"><Percent size={10} /> Tax Rate</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={form.taxRate}
                  onChange={(e) => set("taxRate", Number(e.target.value))}
                  className="input pr-7"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-ink/40">%</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-surface border border-border p-3 text-xs text-ink/60">
            <p className="font-semibold text-ink mb-1">Order Total Calculation</p>
            Subtotal + Shipping (${form.shippingFee.toFixed(2)}) + Tax ({form.taxRate}%) − Discount = Total
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <CheckCircle2 size={14} /> Saved successfully
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-60 transition-colors"
          >
            <Save size={14} />
            {saving ? "Saving…" : "Save Settings"}
          </button>
        </div>
      </form>

      <style jsx>{`
        .label { display: block; margin-bottom: 4px; font-size: 11px; font-weight: 700; color: rgba(20,33,61,0.5); text-transform: uppercase; letter-spacing: 0.05em; }
        .input { width: 100%; border-radius: 10px; border: 1px solid #E3E7F0; background: #F5F7FB; padding: 8px 10px; font-size: 12px; color: #14213D; outline: none; transition: border-color 0.15s; }
        .input:focus { border-color: #2F5FF6; background: white; }
      `}</style>
    </div>
  );
}

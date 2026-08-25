"use client";

import { ReactNode, useState, FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import PageHeader from "@/components/PageHeader";
import { updateSettings } from "@/store/slices/settingsSlice";
import { SettingsState } from "@/types";

interface FieldProps {
  label: string;
  children: ReactNode;
}

function Field({ label, children }: FieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-ink outline-none focus:border-gray-400";

export default function SettingsPage() {
  const settings = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<SettingsState>(settings);

  function handleChange<K extends keyof SettingsState>(key: K, value: SettingsState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSave(e: FormEvent) {
    e.preventDefault();
    dispatch(updateSettings(form));
  }

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage store-wide application settings" />

      <form
        onSubmit={handleSave}
        className="max-w-2xl rounded-2xl border border-gray-200 p-7"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Store Name">
            <input
              className={inputClass}
              value={form.storeName}
              onChange={(e) => handleChange("storeName", e.target.value)}
            />
          </Field>
          <Field label="Currency">
            <select
              className={inputClass}
              value={form.currency}
              onChange={(e) => handleChange("currency", e.target.value as SettingsState["currency"])}
            >
              <option value="USD">USD</option>
              <option value="KHR">KHR</option>
            </select>
          </Field>
          <Field label="Shipping Fee">
            <input
              type="number"
              step="0.01"
              className={inputClass}
              value={form.shippingFee}
              onChange={(e) => handleChange("shippingFee", Number(e.target.value))}
            />
          </Field>
          <Field label="Tax Rate (%)">
            <input
              type="number"
              step="0.01"
              className={inputClass}
              value={form.taxRate}
              onChange={(e) => handleChange("taxRate", Number(e.target.value))}
            />
          </Field>
          <Field label="Contact Email">
            <input
              type="email"
              className={inputClass}
              value={form.contactEmail}
              onChange={(e) => handleChange("contactEmail", e.target.value)}
            />
          </Field>
          <Field label="Contact Phone">
            <input
              className={inputClass}
              value={form.contactPhone}
              onChange={(e) => handleChange("contactPhone", e.target.value)}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Store Description">
              <textarea
                rows={3}
                className={inputClass}
                value={form.storeDescription}
                onChange={(e) => handleChange("storeDescription", e.target.value)}
              />
            </Field>
          </div>
        </div>

        <button
          type="submit"
          className="mt-7 rounded-xl bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

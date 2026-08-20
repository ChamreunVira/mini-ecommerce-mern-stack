"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { store, useCategories } from "@/lib/store";
import { ProductVariant } from "@/types/product";

const emptyVariant = (): ProductVariant => ({
  id: "v_" + Math.random().toString(36).substring(2, 8),
  sku: "",
  color: "",
  size: "",
  price: 0,
  quantity: 0,
});

export default function NewProductPage() {
  const router = useRouter();
  const categories = useCategories();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    discount: "0",
    categoryId: "",
    status: "active" as "active" | "inactive",
    image: "",
    images: [] as string[],
  });
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [imageInput, setImageInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const set = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      e.price = "Valid price required";
    if (!form.quantity || isNaN(Number(form.quantity)) || Number(form.quantity) < 0)
      e.quantity = "Valid quantity required";
    if (!form.categoryId) e.categoryId = "Category required";
    return e;
  };

  const addImage = () => {
    if (!imageInput.trim()) return;
    if (!form.image) setForm((f) => ({ ...f, image: imageInput.trim() }));
    setForm((f) => ({ ...f, images: [...f.images, imageInput.trim()] }));
    setImageInput("");
  };

  const removeImage = (idx: number) => {
    setForm((f) => {
      const next = f.images.filter((_, i) => i !== idx);
      return { ...f, images: next, image: next[0] ?? "" };
    });
  };

  const addVariant = () => setVariants((v) => [...v, emptyVariant()]);
  const removeVariant = (id: string) => setVariants((v) => v.filter((x) => x.id !== id));
  const updateVariant = (id: string, field: keyof ProductVariant, value: string | number) => {
    setVariants((v) => v.map((x) => (x.id === id ? { ...x, [field]: value } : x)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    const cat = categories.find((c) => c.id === form.categoryId);
    store.addProduct({
      name: form.name.trim(),
      slug: form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      description: form.description.trim(),
      price: Number(form.price),
      quantity: Number(form.quantity),
      discount: Number(form.discount) || 0,
      image: form.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
      images: form.images.length > 0 ? form.images : [form.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop"],
      category: cat?.slug ?? "",
      categoryId: form.categoryId,
      status: form.status,
      inStock: Number(form.quantity) > 0,
      variants,
      seller: { id: "s1", name: "Northline Athletics", rating: 4.8 },
      createdAt: new Date().toISOString().split("T")[0],
    });
    router.push("/dashboard/products");
  };

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-white text-ink/60 hover:text-ink shadow-xs"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-ink">Add Product</h1>
          <p className="text-xs text-ink/50">Fill in the details below to create a new product</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <div className="rounded-2xl border border-border bg-white p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-ink">Basic Information</h2>

          <div>
            <label className="label">Name</label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Oversized T-Shirt"
              className="input"
            />
            {errors.name && <p className="field-error">{errors.name}</p>}
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              placeholder="Describe the product…"
              className="input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <label className="label">Price ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="0.00"
                className="input"
              />
              {errors.price && <p className="field-error">{errors.price}</p>}
            </div>
            <div>
              <label className="label">Quantity</label>
              <input
                type="number"
                min="0"
                value={form.quantity}
                onChange={(e) => set("quantity", e.target.value)}
                placeholder="0"
                className="input"
              />
              {errors.quantity && <p className="field-error">{errors.quantity}</p>}
            </div>
            <div>
              <label className="label">Discount (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={form.discount}
                onChange={(e) => set("discount", e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="label">Category</label>
              <select
                value={form.categoryId}
                onChange={(e) => set("categoryId", e.target.value)}
                className="input"
              >
                <option value="">Select…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="field-error">{errors.categoryId}</p>}
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
                  className={`rounded-xl px-4 py-2 text-xs font-bold capitalize transition-all ${
                    form.status === s
                      ? "bg-slate-900 text-white"
                      : "border border-border text-ink/60 hover:bg-surface"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="rounded-2xl border border-border bg-white p-5 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-ink">Images</h2>
          <div className="flex gap-2">
            <input
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              placeholder="Paste image URL…"
              className="input flex-1"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
            />
            <button
              type="button"
              onClick={addImage}
              className="rounded-xl bg-surface border border-border px-3 py-2 text-xs font-bold text-ink hover:bg-white"
            >
              Add
            </button>
          </div>
          {form.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {form.images.map((img, i) => (
                <div key={i} className="relative group">
                  <img src={img} alt="" className="h-16 w-16 rounded-xl object-cover border border-border" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
          {form.images.length === 0 && (
            <div className="flex h-20 items-center justify-center rounded-xl border-2 border-dashed border-border text-ink/30">
              <div className="text-center">
                <ImageIcon size={20} className="mx-auto mb-1" />
                <p className="text-xs">No images added</p>
              </div>
            </div>
          )}
        </div>

        {/* Variants */}
        <div className="rounded-2xl border border-border bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink">Variants</h2>
            <button
              type="button"
              onClick={addVariant}
              className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-ink/70 hover:bg-surface"
            >
              <Plus size={13} /> Add Variant
            </button>
          </div>

          {variants.length === 0 && (
            <p className="text-xs text-ink/40 italic">No variants — product has a single option.</p>
          )}

          {variants.map((v) => (
            <div key={v.id} className="grid grid-cols-2 gap-2 rounded-xl border border-border p-3 sm:grid-cols-6">
              <div>
                <label className="label">SKU</label>
                <input value={v.sku} onChange={(e) => updateVariant(v.id, "sku", e.target.value)} placeholder="TS-BLK-M" className="input" />
              </div>
              <div>
                <label className="label">Color</label>
                <input value={v.color} onChange={(e) => updateVariant(v.id, "color", e.target.value)} placeholder="Black" className="input" />
              </div>
              <div>
                <label className="label">Size</label>
                <input value={v.size} onChange={(e) => updateVariant(v.id, "size", e.target.value)} placeholder="M" className="input" />
              </div>
              <div>
                <label className="label">Price ($)</label>
                <input type="number" min="0" step="0.01" value={v.price || ""} onChange={(e) => updateVariant(v.id, "price", Number(e.target.value))} placeholder="0.00" className="input" />
              </div>
              <div>
                <label className="label">Qty</label>
                <input type="number" min="0" value={v.quantity || ""} onChange={(e) => updateVariant(v.id, "quantity", Number(e.target.value))} placeholder="0" className="input" />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removeVariant(v.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-rose-500 hover:bg-rose-50"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl border border-border px-5 py-2.5 text-xs font-semibold text-ink/70 hover:bg-surface"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {saving ? "Creating…" : "Create Product"}
          </button>
        </div>
      </form>

      <style jsx>{`
        .label { display: block; margin-bottom: 4px; font-size: 11px; font-weight: 700; color: rgba(20,33,61,0.5); text-transform: uppercase; letter-spacing: 0.05em; }
        .input { width: 100%; border-radius: 10px; border: 1px solid #E3E7F0; background: #F5F7FB; padding: 8px 10px; font-size: 12px; color: #14213D; outline: none; transition: border-color 0.15s; }
        .input:focus { border-color: #2F5FF6; background: white; }
        .field-error { margin-top: 3px; font-size: 10px; color: #D64545; font-weight: 600; }
      `}</style>
    </div>
  );
}

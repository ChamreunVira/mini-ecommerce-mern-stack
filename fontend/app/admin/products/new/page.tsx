"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useAppDispatch } from "@/store/store";
import { addProduct } from "@/store/slices/productsSlice";
import { ProductSize, PRODUCT_CATEGORIES } from "@/types";
import PageHeader from "@/components/PageHeader";
import PrimaryButton from "@/components/PrimaryButton";
import FormField, { inputClass, inputErrorClass } from "@/components/FormField";
import { productService, validateProduct, VariantInput } from "@/lib/services/productService";

const SIZES: ProductSize[] = ["S", "M", "L", "XL", "2XL"];

export default function NewProductPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("0");
  const [category, setCategory] = useState<string>("Unisex");
  const [quantity, setQuantity] = useState("0");
  const [imageColor, setImageColor] = useState("#111827");
  const [variants, setVariants] = useState<VariantInput[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function addVariantRow() {
    setVariants((prev) => [
      ...prev,
      {
        color: "Black",
        size: "M",
        price: parseFloat(price) || 0,
        quantity: 10,
      },
    ]);
  }

  function removeVariantRow(index: number) {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  }

  function updateVariant(index: number, field: keyof VariantInput, value: any) {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const parsedPrice = parseFloat(price) || 0;
    const parsedDiscount = parseFloat(discount) || 0;
    const parsedQuantity = parseInt(quantity, 10) || 0;

    const inputData = {
      name,
      description,
      price: parsedPrice,
      discount: parsedDiscount,
      category,
      quantity: parsedQuantity,
      variants,
      status: "In Stock",
      imageColor,
    };

    const validationErrors = validateProduct(inputData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitting(false);
      return;
    }

    try {
      const created = await productService.create(inputData);
      dispatch(addProduct(created));
      router.push("/products");
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-ink mb-4 transition-colors font-medium"
      >
        <ArrowLeft size={16} /> Back to Products
      </Link>

      <PageHeader
        title="Add New Product"
        subtitle="Create a new product with details and optional variant specifications"
      />

      <form onSubmit={handleSubmit} className="space-y-6 mt-6">
        {/* Basic Information */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-base font-semibold text-ink mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Product Name *" error={errors.name} wide>
              <input
                type="text"
                placeholder="e.g. Kdüssy Hoodie"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={errors.name ? inputErrorClass : inputClass}
              />
            </FormField>

            <FormField label="Category *">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputClass}
              >
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Thumbnail Color Swatch">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={imageColor}
                  onChange={(e) => setImageColor(e.target.value)}
                  className="h-10 w-12 cursor-pointer rounded-lg border border-gray-200 p-1"
                />
                <span className="text-sm font-mono text-gray-600">{imageColor}</span>
              </div>
            </FormField>

            <FormField label="Description *" error={errors.description} wide>
              <textarea
                rows={3}
                placeholder="Describe the product material, fit, and style..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={errors.description ? inputErrorClass : inputClass}
              />
            </FormField>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-base font-semibold text-ink mb-4">Pricing & Inventory</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Base Price ($) *" error={errors.price}>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={errors.price ? inputErrorClass : inputClass}
              />
            </FormField>

            <FormField label="Discount (%)" error={errors.discount}>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="0"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className={errors.discount ? inputErrorClass : inputClass}
              />
            </FormField>

            <FormField label="Total Stock Quantity *" error={errors.quantity}>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className={errors.quantity ? inputErrorClass : inputClass}
              />
            </FormField>
          </div>
        </div>

        {/* Product Variants */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-ink">Product Variants</h3>
              <p className="text-xs text-gray-500">
                Add size, color, price, and stock variants if applicable.
              </p>
            </div>
            <button
              type="button"
              onClick={addVariantRow}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-ink hover:bg-gray-50 transition-colors"
            >
              <Plus size={14} /> Add Variant
            </button>
          </div>

          {variants.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center text-sm text-gray-400">
              No variants added yet. Click &quot;Add Variant&quot; above to add specific color/size options.
            </div>
          ) : (
            <div className="space-y-3">
              {variants.map((v, idx) => (
                <div
                  key={idx}
                  className="flex flex-wrap sm:flex-nowrap items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/50 p-3"
                >
                  <div className="w-full sm:w-1/4">
                    <label className="text-xs text-gray-500 font-medium block mb-1">Color</label>
                    <input
                      type="text"
                      placeholder="e.g. Navy"
                      value={v.color}
                      onChange={(e) => updateVariant(idx, "color", e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div className="w-full sm:w-1/5">
                    <label className="text-xs text-gray-500 font-medium block mb-1">Size</label>
                    <select
                      value={v.size}
                      onChange={(e) => updateVariant(idx, "size", e.target.value as ProductSize)}
                      className={inputClass}
                    >
                      {SIZES.map((sz) => (
                        <option key={sz} value={sz}>
                          {sz}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full sm:w-1/4">
                    <label className="text-xs text-gray-500 font-medium block mb-1">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={v.price}
                      onChange={(e) => updateVariant(idx, "price", parseFloat(e.target.value) || 0)}
                      className={inputClass}
                    />
                  </div>

                  <div className="w-full sm:w-1/4">
                    <label className="text-xs text-gray-500 font-medium block mb-1">Quantity</label>
                    <input
                      type="number"
                      min="0"
                      value={v.quantity}
                      onChange={(e) => updateVariant(idx, "quantity", parseInt(e.target.value, 10) || 0)}
                      className={inputClass}
                    />
                  </div>

                  <div className="pt-5 shrink-0">
                    <button
                      type="button"
                      onClick={() => removeVariantRow(idx)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove variant"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/products">
            <PrimaryButton type="button" variant="secondary" icon={false}>
              Cancel
            </PrimaryButton>
          </Link>
          <PrimaryButton type="submit" icon={false} loading={submitting}>
            {submitting ? "Saving..." : "Create Product"}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
}

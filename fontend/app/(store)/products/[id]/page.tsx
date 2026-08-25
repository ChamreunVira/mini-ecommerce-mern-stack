"use client";

import { useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Heart, ShoppingBag, Star, Check, Minus, Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { addItem } from "@/store/slices/cartSlice";
import { toggleWishlist } from "@/store/slices/wishlistSlice";
import { showToast } from "@/store/slices/uiSlice";
import { Product } from "@/types";

// ─── Mock data (replace with API call) ──────────────────────────────────────
const MOCK_PRODUCTS: Record<string, Product & { fullDescription: string; details: string[] }> = {
  p1: {
    id: "p1", name: "Classic Linen Shirt", description: "Premium breathable linen, perfect for warm days.",
    fullDescription: "ស្បែករបស់ Linen Shirt នេះត្រូវបានផ្ដល់ជូនដោយក្រណាត់ Linen ដើម Organic 100% ។ មានការព្យាបាលពណ៌ Eco-friendly ហើយ stitching ដែលជោគជ័យ ធ្វើឱ្យ Shirt នេះមានទម្រង់បែបវិស្ហ្វការ។",
    details: ["100% Organic Linen", "Machine wash cold", "Relaxed fit", "Button-down collar", "Imported"],
    price: 49, discount: 0, category: "Men", quantity: 15, images: [], status: "In Stock", imageColor: "#374151", rating: 4.7, numReviews: 38,
    variants: [
      { id: "v1", color: "ខ្មៅ", colorHex: "#1f2937", size: "S", price: 49, quantity: 5, images: [] },
      { id: "v2", color: "ខ្មៅ", colorHex: "#1f2937", size: "M", price: 49, quantity: 8, images: [] },
      { id: "v3", color: "ដែក", colorHex: "#9ca3af", size: "M", price: 49, quantity: 3, images: [] },
      { id: "v4", color: "ដែក", colorHex: "#9ca3af", size: "L", price: 49, quantity: 6, images: [] },
      { id: "v5", color: "ស", colorHex: "#f9fafb", size: "L", price: 49, quantity: 2, images: [] },
      { id: "v6", color: "ស", colorHex: "#f9fafb", size: "XL", price: 49, quantity: 4, images: [] },
    ],
  },
  p2: {
    id: "p2", name: "Silk Wrap Dress", description: "Elegant silk wrap dress for any occasion.",
    fullDescription: "រូបភាព Elegant និង Timeless ជាមួយ Dress ធ្វើពី Silk ឈ្នានីស តែម្ដង។ ត្រូវបាន design ឱ្យ Flattering ចំពោះ Figure ផ្សេងៗ។",
    details: ["100% Pure Silk", "Dry clean recommended", "Wrap silhouette", "Adjustable tie waist"],
    price: 89, discount: 15, category: "Women", quantity: 8, images: [], status: "In Stock", imageColor: "#831843", rating: 4.9, numReviews: 54,
    variants: [
      { id: "v1", color: "ពណ៌ Ruby", colorHex: "#9f1239", size: "S", price: 89, quantity: 3, images: [] },
      { id: "v2", color: "ពណ៌ Ruby", colorHex: "#9f1239", size: "M", price: 89, quantity: 4, images: [] },
      { id: "v3", color: "ខ្មៅ", colorHex: "#1f2937", size: "M", price: 89, quantity: 2, images: [] },
    ],
  },
};

const MOCK_REVIEWS = [
  { id: "r1", user: "ស្រីនូ វ័នណារ", rating: 5, comment: "ផលិតផលល្អណាស់! ការដឹកជញ្ជូនលឿន ហើយ packaging ក៏ Elegant ផងដែរ។", createdAt: "2026-08-10" },
  { id: "r2", user: "ចន្ទ ពិសី", rating: 4, comment: "មានគុណភាពល្អ ហើយ Fit ជាក់ស្ដែង។ ខ្ញុំ recommend ។", createdAt: "2026-08-05" },
  { id: "r3", user: "ធានី សុជាតិ", rating: 5, comment: "ស្រស់ស្ដើង ដូច photo ពិតប្រាកដ! នឹងទិញ​ ម្ដងទៀត។", createdAt: "2026-07-28" },
];

type Tab = "description" | "details" | "reviews";

interface Params { id: string }

export default function ProductDetailPage({ params }: { params: Promise<Params> }) {
  const { id } = use(params);
  const dispatch = useAppDispatch();

  const product = MOCK_PRODUCTS[id];
  if (!product) notFound();

  const inWishlist = useAppSelector((s) => s.wishlist.items.some((i) => i.productId === id));

  const colors = [...new Set(product.variants.map((v) => v.color))];
  const [selectedColor, setSelectedColor] = useState(colors[0] || "");
  const availableSizes = product.variants.filter((v) => v.color === selectedColor);
  const [selectedSize, setSelectedSize] = useState(availableSizes[0]?.size || "");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<Tab>("description");

  const selectedVariant = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize,
  );

  const finalPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  const stockQty = selectedVariant?.quantity ?? product.quantity;
  const inStock = stockQty > 0;

  const handleAddToCart = () => {
    if (!inStock) return;
    dispatch(
      addItem({
        productId: product.id,
        variantId: selectedVariant?.id,
        name: product.name,
        image: "",
        imageColor: product.imageColor,
        price: finalPrice,
        quantity,
        max: stockQty,
        variant: selectedVariant
          ? { color: selectedVariant.color, size: selectedVariant.size }
          : undefined,
      }),
    );
    dispatch(showToast({ message: "បានបន្ថែមផលិតផលទៅកន្ត្រករួចរាល់" }));
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = "/checkout";
  };

  const handleWishlist = () => {
    dispatch(toggleWishlist({ productId: product.id, name: product.name, price: finalPrice, discount: product.discount, imageColor: product.imageColor, category: product.category }));
    dispatch(showToast({ message: inWishlist ? "បានដកចេញពី Wishlist" : "បានរក្សាទុកក្នុង Wishlist" }));
  };

  const TABS: { key: Tab; label: string }[] = [
    { key: "description", label: "ពិពណ៌នា" },
    { key: "details", label: "ព័ត៌មានលម្អិត" },
    { key: "reviews", label: `ការវាយតម្លៃ (${MOCK_REVIEWS.length})` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
        <Link href="/" className="hover:text-[#0a0a0a]">ទំព័រដើម</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-[#0a0a0a]">ផលិតផល</Link>
        <span>/</span>
        <span className="text-[#0a0a0a] font-medium truncate max-w-[160px]">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Left — Product Gallery */}
        <div className="space-y-3">
          {/* Main image */}
          <div
            className="aspect-[4/5] w-full flex items-center justify-center rounded-sm overflow-hidden"
            style={{ backgroundColor: product.imageColor }}
          >
            <p className="text-white/20 font-black text-8xl tracking-tighter select-none">
              {product.name.slice(0, 2)}
            </p>
          </div>
          {/* Thumbnail strip */}
          <div className="grid grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`aspect-square rounded-sm cursor-pointer border-2 transition-colors ${i === 0 ? "border-[#0a0a0a]" : "border-transparent hover:border-gray-300"}`}
                style={{ backgroundColor: product.imageColor, opacity: 0.7 + i * 0.075 }}
              />
            ))}
          </div>
        </div>

        {/* Right — Product Info */}
        <div className="space-y-6">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-1">{product.category}</p>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-[#0a0a0a] leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill={i < Math.round(product.rating!) ? "currentColor" : "none"} className={i < Math.round(product.rating!) ? "text-amber-400" : "text-gray-200"} />
                  ))}
                </div>
                <span className="text-sm text-gray-500">{product.rating} ({product.numReviews} ការវាយតម្លៃ)</span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black text-[#0a0a0a]">${finalPrice.toFixed(2)}</span>
            {product.discount > 0 && (
              <>
                <span className="text-xl text-gray-400 line-through">${product.price.toFixed(2)}</span>
                <span className="bg-[#0a0a0a] text-white text-xs font-bold px-2 py-0.5">-{product.discount}%</span>
              </>
            )}
          </div>

          {/* Stock status */}
          <div className={`flex items-center gap-1.5 text-sm font-medium ${inStock ? "text-green-600" : "text-red-500"}`}>
            {inStock ? <><Check size={15} /> {stockQty < 5 ? `មានតែ ${stockQty} ទុកបម្រុង!` : "មានក្នុងស្ដុក"}</> : "អស់ស្ដុក"}
          </div>

          {/* Color selector */}
          {colors.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-2.5">
                ពណ៌: <span className="font-normal text-gray-600">{selectedColor}</span>
              </p>
              <div className="flex gap-2.5 flex-wrap">
                {colors.map((color) => {
                  const variant = product.variants.find((v) => v.color === color);
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => { setSelectedColor(color); setSelectedSize((product.variants.find((v) => v.color === color)?.size || "S") as any); }}
                      title={color}
                      className={`h-8 w-8 rounded-full border-2 transition-all ${selectedColor === color ? "border-[#0a0a0a] scale-110" : "border-gray-300 hover:border-gray-500"}`}
                      style={{ backgroundColor: variant?.colorHex || "#ccc" }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Size selector */}
          {availableSizes.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-2.5">ទំហំ</p>
              <div className="flex gap-2 flex-wrap">
                {availableSizes.map((v) => (
                  <button
                    key={v.size}
                    type="button"
                    onClick={() => setSelectedSize(v.size)}
                    disabled={v.quantity === 0}
                    className={`px-4 py-2 text-sm border transition-all rounded-sm disabled:opacity-40 disabled:cursor-not-allowed ${
                      selectedSize === v.size
                        ? "border-[#0a0a0a] bg-[#0a0a0a] text-white font-bold"
                        : "border-gray-300 text-gray-700 hover:border-gray-600"
                    }`}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <p className="text-sm font-semibold mb-2.5">ចំនួន</p>
            <div className="inline-flex items-center border border-gray-300 rounded-sm">
              <button
                type="button"
                className="px-3 py-2 text-gray-600 hover:text-[#0a0a0a] disabled:opacity-40"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center text-sm font-semibold">{quantity}</span>
              <button
                type="button"
                className="px-3 py-2 text-gray-600 hover:text-[#0a0a0a] disabled:opacity-40"
                onClick={() => setQuantity((q) => Math.min(stockQty, q + 1))}
                disabled={quantity >= stockQty}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!inStock}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 border-2 border-[#0a0a0a] text-[#0a0a0a] text-sm font-bold hover:bg-[#0a0a0a] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed rounded-sm"
            >
              <ShoppingBag size={17} /> បន្ថែមទៅកន្ត្រក
            </button>
            <button
              type="button"
              onClick={handleWishlist}
              className={`p-3.5 border-2 rounded-sm transition-all ${inWishlist ? "border-red-400 text-red-500" : "border-gray-300 text-gray-500 hover:border-gray-500"}`}
              aria-label="Wishlist"
            >
              <Heart size={19} fill={inWishlist ? "currentColor" : "none"} />
            </button>
          </div>
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={!inStock}
            className="w-full py-3.5 bg-[#0a0a0a] text-white text-sm font-bold hover:bg-gray-900 transition-colors disabled:opacity-40 rounded-sm"
          >
            ទិញឥឡូវនេះ
          </button>
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────────────────── */}
      <div className="mt-16 border-t border-gray-200">
        <div className="flex gap-8 border-b border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`py-3.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${
                activeTab === tab.key
                  ? "border-[#0a0a0a] text-[#0a0a0a]"
                  : "border-transparent text-gray-500 hover:text-[#0a0a0a]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-8 max-w-2xl">
          {activeTab === "description" && (
            <p className="text-sm text-gray-700 leading-relaxed">{product.fullDescription}</p>
          )}
          {activeTab === "details" && (
            <ul className="space-y-2">
              {product.details.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <Check size={14} className="mt-0.5 text-green-500 shrink-0" /> {d}
                </li>
              ))}
            </ul>
          )}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              {MOCK_REVIEWS.map((r) => (
                <div key={r.id} className="pb-6 border-b border-gray-100 last:border-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-bold text-[#0a0a0a]">{r.user}</span>
                    <span className="text-xs text-gray-400">{r.createdAt}</span>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} fill={i < r.rating ? "currentColor" : "none"} className={i < r.rating ? "text-amber-400" : "text-gray-200"} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

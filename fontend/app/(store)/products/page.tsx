"use client";

import { useState, useMemo, Suspense, use } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";
import ProductCard from "@/components/store/ProductCard";
import { Product } from "@/types";

const MOCK_PRODUCTS: Product[] = [
  { id: "p1", name: "Classic Linen Shirt", description: "Premium breathable linen.", price: 49, discount: 0, category: "Men", quantity: 15, images: [], variants: [], status: "In Stock", imageColor: "#374151", rating: 4.7, numReviews: 38 },
  { id: "p2", name: "Silk Wrap Dress", description: "Elegant silk wrap.", price: 89, discount: 15, category: "Women", quantity: 8, images: [], variants: [], status: "In Stock", imageColor: "#831843", rating: 4.9, numReviews: 54 },
  { id: "p3", name: "Leather Tote Bag", description: "Full-grain leather bag.", price: 120, discount: 0, category: "Accessories", quantity: 6, images: [], variants: [], status: "In Stock", imageColor: "#451a03", rating: 4.8, numReviews: 27 },
  { id: "p4", name: "Essential Hoodie", description: "650g French Terry cotton.", price: 65, discount: 10, category: "Unisex", quantity: 20, images: [], variants: [], status: "In Stock", imageColor: "#1e3a5f", rating: 4.6, numReviews: 41 },
  { id: "p5", name: "Tailored Chinos", description: "Slim-cut stretch chinos.", price: 75, discount: 0, category: "Men", quantity: 12, images: [], variants: [], status: "In Stock", imageColor: "#44403c", rating: 4.5, numReviews: 22 },
  { id: "p6", name: "Floral Midi Skirt", description: "Printed chiffon midi skirt.", price: 55, discount: 20, category: "Women", quantity: 4, images: [], variants: [], status: "In Stock", imageColor: "#701a75", rating: 4.8, numReviews: 33 },
  { id: "p7", name: "Canvas Sneakers", description: "Lightweight canvas sneakers.", price: 85, discount: 0, category: "Unisex", quantity: 18, images: [], variants: [], status: "In Stock", imageColor: "#d6d3d1", rating: 4.4, numReviews: 67 },
  { id: "p8", name: "Reversible Cap", description: "Adjustable reversible baseball cap.", price: 35, discount: 0, category: "Accessories", quantity: 0, images: [], variants: [], status: "Out of Stock", imageColor: "#292524", rating: 4.3, numReviews: 19 },
  { id: "p9", name: "Oxford Button Shirt", description: "Classic oxford cloth.", price: 58, discount: 0, category: "Men", quantity: 10, images: [], variants: [], status: "In Stock", imageColor: "#1d4ed8", rating: 4.6, numReviews: 29 },
  { id: "p10", name: "Cashmere Sweater", description: "Pure cashmere knit.", price: 145, discount: 10, category: "Women", quantity: 5, images: [], variants: [], status: "In Stock", imageColor: "#9f1239", rating: 4.9, numReviews: 42 },
  { id: "p11", name: "Nylon Crossbody Bag", description: "Lightweight everyday bag.", price: 45, discount: 0, category: "Accessories", quantity: 14, images: [], variants: [], status: "In Stock", imageColor: "#064e3b", rating: 4.5, numReviews: 31 },
  { id: "p12", name: "Slim Joggers", description: "Tapered fit jogger pants.", price: 55, discount: 15, category: "Unisex", quantity: 9, images: [], variants: [], status: "In Stock", imageColor: "#3f3f46", rating: 4.4, numReviews: 24 },
];

const CATEGORIES = ["Men", "Women", "Unisex", "Accessories"];

const SORT_OPTIONS = [
  { value: "default", label: "ពេញនិយម" },
  { value: "newest", label: "ថ្មីបំផុត" },
  { value: "price_asc", label: "តម្លៃទាបទៅខ្ពស់" },
  { value: "price_desc", label: "តម្លៃខ្ពស់ទៅទាប" },
  { value: "rating", label: "ការវាយតម្លៃ" },
];

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 py-5">
      <button
        type="button"
        className="flex items-center justify-between w-full text-sm font-bold text-[#0a0a0a] mb-3"
        onClick={() => setOpen((v) => !v)}
      >
        {title}
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
      {open && children}
    </div>
  );
}

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialSearch = searchParams.get("search") || "";
  const initialFilter = searchParams.get("filter") || "";

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : [],
  );
  const [priceMax, setPriceMax] = useState(200);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState(
    initialFilter === "newest" ? "newest" : initialFilter === "top" ? "rating" : "default",
  );
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const filtered = useMemo(() => {
    let list = [...MOCK_PRODUCTS];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (selectedCategories.length > 0) {
      list = list.filter((p) => selectedCategories.includes(p.category));
    }
    if (inStockOnly) {
      list = list.filter((p) => p.quantity > 0);
    }
    list = list.filter((p) => {
      const final = p.discount ? p.price - (p.price * p.discount) / 100 : p.price;
      return final <= priceMax;
    });

    switch (sortBy) {
      case "newest": return list.reverse();
      case "price_asc": return list.sort((a, b) => a.price - b.price);
      case "price_desc": return list.sort((a, b) => b.price - a.price);
      case "rating": return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      default: return list;
    }
  }, [searchQuery, selectedCategories, inStockOnly, priceMax, sortBy]);

  const hasFilters = selectedCategories.length > 0 || inStockOnly || priceMax < 200;

  const FilterPanel = (
    <div className="space-y-0">
      <FilterSection title="ប្រភេទ">
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className="w-4 h-4 border-gray-300 text-[#0a0a0a] rounded-sm accent-[#0a0a0a]"
              />
              <span className="text-sm text-gray-700 group-hover:text-[#0a0a0a]">{cat}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="ជួរតម្លៃ">
        <div className="space-y-3">
          <input
            type="range"
            min={10}
            max={200}
            value={priceMax}
            onChange={(e) => setPriceMax(Number(e.target.value))}
            className="w-full accent-[#0a0a0a]"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>$0</span>
            <span className="font-semibold text-[#0a0a0a]">ដល់ ${priceMax}</span>
          </div>
        </div>
      </FilterSection>

      <FilterSection title="ស្ថានភាព Stock">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 accent-[#0a0a0a]"
          />
          <span className="text-sm text-gray-700">មានស្ដុកប៉ុណ្ណោះ</span>
        </label>
      </FilterSection>

      {hasFilters && (
        <button
          type="button"
          onClick={() => { setSelectedCategories([]); setInStockOnly(false); setPriceMax(200); }}
          className="mt-4 w-full text-xs font-semibold text-gray-500 hover:text-[#0a0a0a] flex items-center justify-center gap-1.5 py-2 border border-gray-200 rounded-sm hover:border-gray-400 transition-colors"
        >
          <X size={13} /> សម្អាត Filter ទាំងអស់
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-[#0a0a0a]">ទំព័រដើម</Link>
        <span>/</span>
        <span className="text-[#0a0a0a] font-medium">ផលិតផល</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">ផលិតផល</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} ផលិតផល</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-sm hover:border-gray-400 transition-colors"
          >
            <SlidersHorizontal size={15} /> Filter
          </button>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 whitespace-nowrap hidden sm:block">តម្រៀបតាម</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 text-sm rounded-sm focus:outline-none focus:border-[#0a0a0a] bg-white cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ស្វែងរកផលិតផល..."
          className="w-full sm:max-w-sm px-4 py-2.5 border border-gray-300 text-sm rounded-sm focus:outline-none focus:border-[#0a0a0a] transition-colors"
        />
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">{FilterPanel}</aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <div className="relative w-72 bg-white h-full overflow-y-auto p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Filter</h3>
                <button onClick={() => setSidebarOpen(false)}><X size={18} /></button>
              </div>
              {FilterPanel}
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <p className="text-lg font-semibold text-[#0a0a0a]">
                មិនមានផលិតផលដែលត្រូវនឹងការស្វែងរករបស់អ្នកទេ
              </p>
              <p className="text-sm text-gray-500">
                សូមព្យាយាមផ្លាស់ប្ដូរ Filter ឬស្វែងរកឡើងវិញ
              </p>
              <button
                type="button"
                onClick={() => { setSelectedCategories([]); setInStockOnly(false); setPriceMax(200); setSearchQuery(""); }}
                className="mt-2 px-5 py-2.5 border border-[#0a0a0a] text-sm font-semibold rounded-sm hover:bg-[#0a0a0a] hover:text-white transition-colors"
              >
                សម្អាត Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-gray-400">Loading...</div>}>
      <CatalogContent />
    </Suspense>
  );
}

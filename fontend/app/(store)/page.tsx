"use client";

import Link from "next/link";
import { ArrowRight, Star, Grid, Sparkles, TrendingUp, MessageSquareQuote, Mail } from "lucide-react";
import ProductCard from "@/components/store/ProductCard";
import HeroCarousel from "@/components/store/HeroCarousel";
import { Product } from "@/types";

// ─── Mock data — replace with API calls ──────────────────────────────────────

const MOCK_CATEGORIES = [
  { name: "បុរស", slug: "Men", color: "#1f2937", count: 48 },
  { name: "នារី", slug: "Women", color: "#9d174d", count: 62 },
  { name: "Unisex", slug: "Unisex", color: "#065f46", count: 24 },
  { name: "Accessories", slug: "Accessories", color: "#78350f", count: 33 },
];

const MOCK_PRODUCTS: Product[] = [
  { id: "p1", name: "Classic Linen Shirt", description: "", price: 49, discount: 0, category: "Men", quantity: 15, images: [], variants: [], status: "In Stock", imageColor: "#374151", rating: 4.7, numReviews: 38 },
  { id: "p2", name: "Silk Wrap Dress", description: "", price: 89, discount: 15, category: "Women", quantity: 8, images: [], variants: [], status: "In Stock", imageColor: "#831843", rating: 4.9, numReviews: 54 },
  { id: "p3", name: "Leather Tote Bag", description: "", price: 120, discount: 0, category: "Accessories", quantity: 6, images: [], variants: [], status: "In Stock", imageColor: "#451a03", rating: 4.8, numReviews: 27 },
  { id: "p4", name: "Essential Hoodie", description: "", price: 65, discount: 10, category: "Unisex", quantity: 20, images: [], variants: [], status: "In Stock", imageColor: "#1e3a5f", rating: 4.6, numReviews: 41 },
  { id: "p5", name: "Tailored Chinos", description: "", price: 75, discount: 0, category: "Men", quantity: 12, images: [], variants: [], status: "In Stock", imageColor: "#44403c", rating: 4.5, numReviews: 22 },
  { id: "p6", name: "Floral Midi Skirt", description: "", price: 55, discount: 20, category: "Women", quantity: 4, images: [], variants: [], status: "In Stock", imageColor: "#701a75", rating: 4.8, numReviews: 33 },
  { id: "p7", name: "Canvas Sneakers", description: "", price: 85, discount: 0, category: "Unisex", quantity: 18, images: [], variants: [], status: "In Stock", imageColor: "#f3f4f6", rating: 4.4, numReviews: 67 },
  { id: "p8", name: "Reversible Cap", description: "", price: 35, discount: 0, category: "Accessories", quantity: 0, images: [], variants: [], status: "Out of Stock", imageColor: "#292524", rating: 4.3, numReviews: 19 },
];

const TESTIMONIALS = [
  { name: "ស្រីនូ វ័នណារ", rating: 5, text: "ផលិតផលមានគុណភាពល្អ ហើយការដឹកជញ្ជូនលឿនជាងដែលខ្ញុំរំពឹងទុក។ ចូលចិត្តណាស់!", verified: true },
  { name: "ចន្ទ ពិសី", rating: 5, text: "ការបម្រើសេវាល្អ ហើយស្ទីលច្រើន។ ខ្ញុំបានបញ្ជាទិញ ៣ លើកហើយ។", verified: true },
  { name: "ធារ៉ា ណារ", rating: 4, text: "ទំនិញល្អ តម្លៃសមរម្យ Packaging ថ្នូររបស់ពួកគេក៏ល្អផងដែរ។", verified: true },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          fill={i < rating ? "currentColor" : "none"}
          className={i < rating ? "text-amber-400" : "text-gray-300"}
        />
      ))}
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────

export default function StorePage() {
  const newArrivals = MOCK_PRODUCTS.slice(0, 4);
  const trending = MOCK_PRODUCTS.slice(4, 8);

  return (
    <div className="text-[#0a0a0a]">

      {/* ── A. HERO CAROUSEL ────────────────────────────────────────────────── */}
      <HeroCarousel />

      {/* ── B. SHOP BY CATEGORY ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-sm bg-gray-100 flex items-center justify-center text-[#0a0a0a]">
              <Grid size={20} />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0a0a0a] tracking-tight leading-snug">
                ទិញតាមប្រភេទ
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">ជ្រើសរើសប្រភេទសំលៀកបំពាក់ និង Accessories ដែលអ្នកចូលចិត្ត</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {MOCK_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group relative overflow-hidden aspect-[3/4] block rounded-sm shadow-sm"
            >
              <div
                className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundColor: cat.color }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white font-extrabold text-lg sm:text-xl leading-snug">{cat.name}</p>
                <p className="text-gray-300 text-xs sm:text-sm mt-1 font-medium">{cat.count} ផលិតផល</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── C. NEW ARRIVALS ───────────────────────────────────────────────── */}
      <section className="bg-gray-50/80 py-16 lg:py-24 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-sm bg-[#0a0a0a] text-white flex items-center justify-center">
                <Sparkles size={20} />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-snug">ផលិតផលមកដល់ថ្មី</h2>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">ម៉ូដចុងក្រោយទើបតែបន្ថែមក្នុងស្តុក</p>
              </div>
            </div>
            <Link
              href="/products?filter=newest"
              className="hidden sm:flex items-center gap-2 text-sm font-extrabold text-[#0a0a0a] hover:underline underline-offset-4"
            >
              មើលទាំងអស់ <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-7">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── D. TRENDING PRODUCTS ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-sm bg-amber-500 text-white flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-snug">ផលិតផលពេញនិយម</h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">ផលិតផលដែលទទួលបានការបញ្ជាទិញច្រើនជាងគេ</p>
            </div>
          </div>
          <Link
            href="/products?filter=top"
            className="hidden sm:flex items-center gap-2 text-sm font-extrabold text-[#0a0a0a] hover:underline underline-offset-4"
          >
            មើលទាំងអស់ <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-7">
          {trending.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ── E. SALE BANNER ───────────────────────────────────────────────── */}
      <section className="bg-[#0a0a0a] py-20 lg:py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="inline-block text-xs font-black tracking-[0.3em] text-amber-400 uppercase mb-4 px-3 py-1 bg-white/10 rounded-full">
            Limited Time Offer
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.2] tracking-tight">
            បញ្ចុះតម្លៃ 25% សម្រាប់ការលក់ពិសេស
          </h2>
          <p className="mt-5 text-gray-300 text-base sm:text-lg leading-[1.8] font-normal">
            ទទួលបានការបញ្ចុះតម្លៃ 25% សម្រាប់ការលក់ពិសេសរបស់យើង។<br className="hidden sm:inline" />
            ផលិតផលជាច្រើនមានចំនួនកំណត់ — ទទួលបាននៅ​ពេលនៅ​ជាប់ Stock!
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products?filter=sale"
              className="px-9 py-4 bg-white text-[#0a0a0a] font-extrabold text-sm hover:bg-gray-100 transition-colors tracking-wide"
            >
              ទទួលបានការផ្ដល់ជូនឥឡូវនេះ
            </Link>
          </div>
        </div>
      </section>

      {/* ── F. TESTIMONIALS ──────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="h-10 w-10 rounded-sm bg-gray-100 text-[#0a0a0a] flex items-center justify-center mx-auto mb-3">
            <MessageSquareQuote size={20} />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-2 leading-snug">
            អ្វីដែលអតិថិជននិយាយ
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            ចាប់ពីអតិថិជនជិត 1,000+ នាក់ ដែលទុកចិត្តបញ្ជាទិញទំនិញជាមួយយើង
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="border border-gray-200 p-6 sm:p-7 space-y-4 hover:border-gray-400 transition-colors rounded-sm bg-white">
              <Stars rating={t.rating} />
              <p className="text-sm sm:text-base text-gray-700 leading-[1.7] font-normal">&ldquo;{t.text}&rdquo;</p>
              <div className="pt-2 border-t border-gray-100">
                <p className="text-sm font-extrabold text-[#0a0a0a]">{t.name}</p>
                {t.verified && (
                  <p className="text-xs text-green-600 font-bold mt-0.5">✓ Verified Purchase</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── G. NEWSLETTER ────────────────────────────────────────────────── */}
      <section className="bg-gray-50 border-t border-gray-200 py-16 lg:py-20">
        <div className="max-w-xl mx-auto px-6 text-center">
          <div className="h-10 w-10 rounded-sm bg-[#0a0a0a] text-white flex items-center justify-center mx-auto mb-3">
            <Mail size={20} />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mb-2 leading-snug">ទទួលព័ត៌មានថ្មីៗ</h2>
          <p className="text-xs sm:text-sm text-gray-500 mb-6 font-medium">
            ចុះឈ្មោះដើម្បីទទួលព័ត៌មានអំពី Collection ថ្មី និងការផ្ដល់ជូនពិសេស
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex gap-2"
          >
            <input
              type="email"
              placeholder="បញ្ចូលអ៊ីមែលរបស់អ្នក"
              className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-sm focus:outline-none focus:border-[#0a0a0a] transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#0a0a0a] text-white text-sm font-extrabold rounded-sm hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              ចុះឈ្មោះ
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-3 font-medium">
            លោកអ្នកអាចលុបចោលការជាវបានគ្រប់ពេល
          </p>
        </div>
      </section>
    </div>
  );
}

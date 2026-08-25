"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, TrendingUp } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setSearchOpen } from "@/store/slices/uiSlice";

const TRENDING = ["Sneakers", "T-Shirt", "Jacket", "Accessories", "Bag"];

export default function SearchOverlay() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isOpen = useAppSelector((s) => s.ui.searchOpen);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch(setSearchOpen(false));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    dispatch(setSearchOpen(false));
    router.push(`/products?search=${encodeURIComponent(query.trim())}`);
  };

  const handleTrending = (term: string) => {
    dispatch(setSearchOpen(false));
    router.push(`/products?search=${encodeURIComponent(term)}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-white/95 backdrop-blur-sm" onClick={() => dispatch(setSearchOpen(false))} />

      <div className="relative z-10 max-w-3xl mx-auto w-full px-4 pt-16 sm:pt-24">
        {/* Close */}
        <div className="flex justify-end mb-6">
          <button type="button" onClick={() => dispatch(setSearchOpen(false))} className="p-2 text-gray-400 hover:text-[#0a0a0a]">
            <X size={24} />
          </button>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ស្វែងរកផលិតផល..."
              className="w-full pl-12 pr-4 py-4 text-lg border-b-2 border-gray-200 focus:border-[#0a0a0a] bg-transparent text-[#0a0a0a] outline-none placeholder:text-gray-400 transition-colors"
            />
          </div>
        </form>

        {/* Trending */}
        <div className="mt-8">
          <p className="flex items-center gap-2 text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">
            <TrendingUp size={14} /> ការស្វែងរកពេញនិយម
          </p>
          <div className="flex flex-wrap gap-2">
            {TRENDING.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleTrending(term)}
                className="px-4 py-2 border border-gray-200 text-sm text-gray-700 hover:border-[#0a0a0a] hover:text-[#0a0a0a] rounded-sm transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Eye, ShoppingBag, Check } from "lucide-react";
import { Product } from "@/types";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { addItem } from "@/store/slices/cartSlice";
import { toggleWishlist } from "@/store/slices/wishlistSlice";
import { showToast } from "@/store/slices/uiSlice";

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((s) => s.wishlist.items);
  const isWishlisted = wishlistItems.some((w) => w.productId === product.id);

  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      addItem({
        productId: product.id,
        name: product.name,
        image: product.images?.[0] || "",
        imageColor: product.imageColor,
        price: product.price,
        quantity: 1,
        max: product.quantity,
      }),
    );
    dispatch(showToast({ message: `បានបន្ថែម "${product.name}" ទៅកន្ត្រក` }));
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      toggleWishlist({
        productId: product.id,
        name: product.name,
        price: product.price,
        discount: product.discount || 0,
        imageColor: product.imageColor,
        category: product.category,
      }),
    );
    dispatch(
      showToast({
        message: isWishlisted ? "បានដកចេញពី Wishlist" : "បានបន្ថែមទៅ Wishlist",
        type: isWishlisted ? "info" : "success",
      }),
    );
  };

  const hasDiscount = product.discount && product.discount > 0;
  const originalPrice = hasDiscount
    ? (product.price / (1 - product.discount / 100)).toFixed(2)
    : null;

  return (
    <div className="group border border-gray-200 rounded-sm overflow-hidden bg-white hover:border-gray-400 transition-all flex flex-col justify-between">
      <div>
        {/* Image Container */}
        <div
          className="aspect-[3/4] w-full relative flex items-end justify-between p-3 overflow-hidden"
          style={{ backgroundColor: product.imageColor || "#374151" }}
        >
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            {hasDiscount && (
              <span className="bg-[#0a0a0a] text-white text-[11px] font-extrabold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                -{product.discount}%
              </span>
            )}
            {product.quantity <= 0 && (
              <span className="bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-sm">
                អស់ពីស្តុក
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={handleWishlist}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all z-10 shadow-sm ${
              isWishlisted
                ? "bg-red-500 text-white"
                : "bg-white/90 text-gray-700 hover:bg-white hover:text-red-500"
            }`}
            aria-label="Wishlist"
          >
            <Heart size={15} fill={isWishlisted ? "currentColor" : "none"} />
          </button>

          {/* Quick View Link */}
          <Link
            href={`/products/${product.id}`}
            className="absolute inset-0 z-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <span className="bg-white/90 text-[#0a0a0a] text-xs font-bold px-3 py-1.5 rounded-sm shadow-sm flex items-center gap-1">
              <Eye size={14} /> មើលលម្អិត
            </span>
          </Link>
        </div>

        {/* Product Details */}
        <div className="p-4 space-y-1.5">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            {product.category}
          </p>
          <Link
            href={`/products/${product.id}`}
            className="text-base font-bold text-[#0a0a0a] hover:underline block truncate leading-snug"
          >
            {product.name}
          </Link>

          {/* Pricing display */}
          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-base font-extrabold text-[#0a0a0a]">
              ${product.price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-xs text-gray-400 line-through font-medium">
                ${originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ALWAYS VISIBLE Add to Cart Button */}
      <div className="p-4 pt-1 border-t border-gray-100">
        <button
          type="button"
          disabled={product.quantity <= 0}
          onClick={handleAddToCart}
          className={`w-full py-2.5 px-3 text-xs font-extrabold rounded-sm transition-all flex items-center justify-center gap-2 ${
            product.quantity <= 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
              : added
              ? "bg-green-700 text-white"
              : "bg-[#0a0a0a] text-white hover:bg-gray-800 active:scale-[0.99]"
          }`}
        >
          {added ? (
            <>
              <Check size={14} /> បានបន្ថែម
            </>
          ) : product.quantity <= 0 ? (
            "មិនមានក្នុងស្តុក"
          ) : (
            <>
              <ShoppingBag size={14} /> បន្ថែមទៅកន្ត្រក • ${product.price.toFixed(2)}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

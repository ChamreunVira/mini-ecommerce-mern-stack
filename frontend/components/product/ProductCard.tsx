"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Product } from "@/types/product";
import Rating from "@/components/ui/Rating";

export default function ProductCard({ product }: { product: Product }) {
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block overflow-hidden rounded-card border border-border bg-white transition-shadow hover:shadow-card"
    >
      <div className="relative aspect-square overflow-hidden bg-surface">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button
          type="button"
          aria-label="Save to wishlist"
          onClick={(e) => e.preventDefault()}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink/60 hover:text-sale"
        >
          <Heart size={15} />
        </button>
        {onSale && (
          <span className="absolute left-2 top-2 rounded-full bg-sale px-2 py-0.5 text-[11px] font-medium text-white">
            Sale
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="line-clamp-2 text-sm font-medium text-ink">{product.name}</p>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-sm font-semibold text-ink tabular">${product.price.toFixed(2)}</span>
          {onSale && (
            <span className="text-xs text-ink/40 line-through tabular">
              ${product.compareAtPrice!.toFixed(2)}
            </span>
          )}
        </div>
        <div className="mt-1.5">
          <Rating value={product.rating} reviewCount={product.reviewCount} />
        </div>
      </div>
    </Link>
  );
}

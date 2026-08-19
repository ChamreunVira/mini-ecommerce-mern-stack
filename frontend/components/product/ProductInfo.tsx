"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Product } from "@/types/product";
import Rating from "@/components/ui/Rating";
import QuantityStepper from "@/components/ui/QuantityStepper";

export default function ProductInfo({ product }: { product: Product }) {
  const [color, setColor] = useState(product.colors?.[0]);
  const [size, setSize] = useState(product.sizes?.[0]);
  const [quantity, setQuantity] = useState(1);
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;
  const discount = onSale ? Math.round(100 - (product.price / product.compareAtPrice!) * 100) : 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">{product.name}</h1>

      <div className="mt-2 flex items-center gap-3">
        <span className="text-2xl font-semibold text-ink tabular">${product.price.toFixed(2)}</span>
        {onSale && (
          <>
            <span className="text-base text-ink/40 line-through tabular">
              ${product.compareAtPrice!.toFixed(2)}
            </span>
            <span className="rounded-full bg-sale/10 px-2 py-0.5 text-xs font-medium text-sale">
              {discount}% OFF
            </span>
          </>
        )}
      </div>

      <div className="mt-2">
        <Rating value={product.rating} reviewCount={product.reviewCount} size={16} />
      </div>

      <p className="mt-4 text-sm leading-relaxed text-ink/70">{product.description}</p>

      <p className="mt-4 text-xs text-ink/50">
        Sold by{" "}
        <span className="font-medium text-ink/70">{product.seller.name}</span> · {product.seller.rating}★ seller rating
      </p>

      {product.colors && (
        <div className="mt-5">
          <p className="text-sm font-medium text-ink">Color</p>
          <div className="mt-2 flex gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Select color ${c}`}
                onClick={() => setColor(c)}
                style={{ backgroundColor: c }}
                className={`h-8 w-8 rounded-full border-2 ${
                  color === c ? "border-primary" : "border-transparent"
                } ring-1 ring-border`}
              />
            ))}
          </div>
        </div>
      )}

      {product.sizes && (
        <div className="mt-5">
          <p className="text-sm font-medium text-ink">Size</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={`h-9 min-w-9 rounded-card border px-3 text-sm ${
                  size === s ? "border-primary text-primary" : "border-border text-ink/70 hover:border-primary"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5">
        <p className="text-sm font-medium text-ink">Quantity</p>
        <div className="mt-2">
          <QuantityStepper quantity={quantity} onChange={setQuantity} />
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          className="flex-1 rounded-card border border-primary py-3 text-sm font-medium text-primary hover:bg-primary-light"
        >
          Add to Cart
        </button>
        <button
          type="button"
          className="flex-1 rounded-card bg-primary py-3 text-sm font-medium text-white hover:bg-primary-hover"
        >
          Buy Now
        </button>
      </div>

      <button type="button" className="mt-4 flex items-center gap-1.5 text-sm text-ink/60 hover:text-sale">
        <Heart size={16} />
        Add to Wishlist
      </button>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import Rating from "@/components/ui/Rating";

const TABS = ["Description", "Additional Information", "Reviews"] as const;

export default function ProductTabs({ product }: { product: Product }) {
  const [active, setActive] = useState<(typeof TABS)[number]>("Description");

  return (
    <div className="mt-12">
      <div className="flex gap-6 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={`-mb-px border-b-2 pb-3 text-sm font-medium ${
              active === tab ? "border-primary text-primary" : "border-transparent text-ink/50 hover:text-ink"
            }`}
          >
            {tab === "Reviews" ? `Reviews (${product.reviewCount})` : tab}
          </button>
        ))}
      </div>

      <div className="py-6 text-sm leading-relaxed text-ink/70">
        {active === "Description" && (
          <p>
            {product.description ||
              "This product doesn't have a detailed description yet. Check back soon or contact the seller for more information."}
          </p>
        )}
        {active === "Additional Information" && (
          <ul className="space-y-2">
            <li>
              <span className="font-medium text-ink">Category:</span> {product.category}
            </li>
            <li>
              <span className="font-medium text-ink">Seller:</span> {product.seller.name}
            </li>
            {product.colors && (
              <li>
                <span className="font-medium text-ink">Available colors:</span> {product.colors.length}
              </li>
            )}
            {product.sizes && (
              <li>
                <span className="font-medium text-ink">Available sizes:</span> {product.sizes.join(", ")}
              </li>
            )}
          </ul>
        )}
        {active === "Reviews" && (
          <div className="space-y-4">
            <Rating value={product.rating} reviewCount={product.reviewCount} size={16} />
            <p className="text-ink/50">Customer reviews will appear here once connected to real order data.</p>
          </div>
        )}
      </div>
    </div>
  );
}

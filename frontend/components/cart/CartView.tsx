"use client";

import { useState } from "react";
import { CartLine } from "@/types/product";
import { getProductBySlug } from "@/lib/data";
import CartItemRow from "@/components/cart/CartItemRow";
import OrderSummary from "@/components/cart/OrderSummary";

const initialSlugs = ["wireless-headphones", "smart-watch", "everyday-backpack", "mens-running-shoes"];

function buildInitialLines(): CartLine[] {
  return initialSlugs
    .map((slug) => getProductBySlug(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((product) => ({ product, quantity: 1 }));
}

export default function CartView() {
  const [lines, setLines] = useState<CartLine[]>(buildInitialLines);

  const updateQuantity = (productId: string, quantity: number) => {
    setLines((prev) => prev.map((l) => (l.product.id === productId ? { ...l, quantity } : l)));
  };

  const removeLine = (productId: string) => {
    setLines((prev) => prev.filter((l) => l.product.id !== productId));
  };

  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 5.99;

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Your Cart</h1>

      {lines.length === 0 ? (
        <p className="mt-8 text-sm text-ink/50">Your cart is empty.</p>
      ) : (
        <div className="mt-6 flex flex-col gap-8 md:flex-row">
          <div className="flex-1 rounded-card border border-border p-5">
            <div className="hidden grid-cols-[auto,1fr,auto,auto,auto,auto] gap-4 pb-3 text-xs font-medium uppercase tracking-wide text-ink/40 sm:grid">
              <span />
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Subtotal</span>
              <span />
            </div>
            {lines.map((line) => (
              <CartItemRow
                key={line.product.id}
                line={line}
                onQuantityChange={updateQuantity}
                onRemove={removeLine}
              />
            ))}
          </div>

          <OrderSummary subtotal={subtotal} shipping={shipping} taxRate={0.1} />
        </div>
      )}
    </div>
  );
}

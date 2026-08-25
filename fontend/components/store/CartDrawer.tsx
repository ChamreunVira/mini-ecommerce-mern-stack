"use client";

import Link from "next/link";
import { X, ShoppingBag, Plus, Minus, Trash2, QrCode, ArrowRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setDrawerOpen, removeItem, updateQuantity } from "@/store/slices/cartSlice";

export default function CartDrawer() {
  const dispatch = useAppDispatch();
  const { isOpen, items, subtotal, shippingFee, total, totalItems } = useAppSelector((s) => s.cart);

  const close = () => dispatch(setDrawerOpen(false));

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="font-bold text-base text-[#0a0a0a] flex items-center gap-2">
            <ShoppingBag size={18} />
            កន្ត្រករបស់អ្នក
            {totalItems > 0 && (
              <span className="ml-1 text-xs text-gray-500">({totalItems})</span>
            )}
          </h2>
          <button type="button" onClick={close} className="p-1.5 text-gray-500 hover:text-[#0a0a0a]">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-16 text-center">
              <ShoppingBag size={48} className="text-gray-200" />
              <div>
                <p className="font-semibold text-[#0a0a0a]">កន្ត្រករបស់អ្នកទទេ</p>
                <p className="text-sm text-gray-500 mt-1">បន្ថែមផលិតផលដើម្បីចាប់ផ្ដើម</p>
              </div>
              <button
                type="button"
                onClick={close}
                className="px-4 py-2 border border-[#0a0a0a] text-sm font-semibold text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white rounded-sm transition-colors"
              >
                ចாប់ផ្ដើមទិញ
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {items.map((item) => {
                const key = item.variantId ? `${item.productId}-${item.variantId}` : item.productId;
                return (
                  <li key={key} className="py-4 flex gap-4">
                    {/* Image */}
                    <div
                      className="h-20 w-16 shrink-0 rounded-sm border border-gray-100 flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: item.imageColor || "#374151" }}
                    >
                      {item.name.slice(0, 2)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#0a0a0a] truncate">{item.name}</p>
                      {item.variant && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.variant.color} · {item.variant.size}
                        </p>
                      )}
                      <p className="text-sm font-bold text-[#0a0a0a] mt-1">${item.price.toFixed(2)}</p>

                      {/* Quantity */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => dispatch(updateQuantity({ productId: item.productId, variantId: item.variantId, quantity: item.quantity - 1 }))}
                          className="p-1 border border-gray-200 rounded-sm text-gray-600 hover:border-gray-400 disabled:opacity-40"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => dispatch(updateQuantity({ productId: item.productId, variantId: item.variantId, quantity: item.quantity + 1 }))}
                          className="p-1 border border-gray-200 rounded-sm text-gray-600 hover:border-gray-400 disabled:opacity-40"
                          disabled={item.quantity >= item.max}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => dispatch(removeItem({ productId: item.productId, variantId: item.variantId }))}
                      className="p-1.5 text-gray-400 hover:text-red-500 self-start"
                      aria-label="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer — Totals + CTA */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 px-5 py-5 space-y-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>ការដឹកជញ្ជូន</span>
                <span>{shippingFee === 0 ? <span className="text-green-600 font-medium">ឥតគិតថ្លៃ</span> : `$${shippingFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-bold text-base text-[#0a0a0a] pt-2 border-t border-gray-200">
                <span>សរុប</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            {shippingFee > 0 && (
              <p className="text-xs text-gray-500">
                ✦ ទទួលបានការដឹកជញ្ជូនឥតគិតថ្លៃ ពេលបញ្ជាទិញលើសពី $50
              </p>
            )}
            <Link
              href="/checkout"
              onClick={close}
              className="flex items-center justify-center gap-2 w-full bg-[#0a0a0a] text-white text-sm font-bold py-3 rounded-sm hover:bg-gray-900 transition-colors"
            >
              <QrCode size={16} /> បន្តទៅ Checkout
            </Link>
            <button
              type="button"
              onClick={close}
              className="flex items-center justify-center gap-2 w-full border border-gray-300 text-sm font-medium py-2.5 rounded-sm text-gray-700 hover:border-gray-400 transition-colors"
            >
              <ArrowRight size={15} /> បន្តទិញទំនិញ
            </button>
          </div>
        )}
      </div>
    </>
  );
}

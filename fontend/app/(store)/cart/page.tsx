"use client";

import Link from "next/link";
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, QrCode } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { removeItem, updateQuantity } from "@/store/slices/cartSlice";
import { showToast } from "@/store/slices/uiSlice";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { items, subtotal, shippingFee, total, totalItems } = useAppSelector((s) => s.cart);

  const handleRemove = (productId: string, variantId?: string) => {
    dispatch(removeItem({ productId, variantId }));
    dispatch(showToast({ message: "បានដកផលិតផលចេញពីកន្ត្រក", type: "info" }));
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-5">
        <ShoppingBag size={56} className="mx-auto text-gray-200" />
        <h1 className="text-2xl font-extrabold text-[#0a0a0a]">កន្ត្រករបស់អ្នកទទេ</h1>
        <p className="text-sm text-gray-500">
          អ្នកមិនទាន់មានផលិតផលក្នុងកន្ត្រករបស់អ្នកទេ
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#0a0a0a] text-white text-sm font-bold rounded-sm hover:bg-gray-900 transition-colors"
        >
          <ArrowRight size={16} /> ចាប់ផ្ដើមទិញ
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight mb-8">
        កន្ត្រករបស់អ្នក
        <span className="ml-3 text-base font-normal text-gray-500">({totalItems} ផលិតផល)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Item List */}
        <div className="lg:col-span-7 space-y-0">
          <div className="hidden sm:grid sm:grid-cols-12 text-xs text-gray-400 font-bold uppercase tracking-wider pb-3 border-b border-gray-200">
            <span className="col-span-6">ផលិតផល</span>
            <span className="col-span-2 text-center">តម្លៃ</span>
            <span className="col-span-2 text-center">ចំនួន</span>
            <span className="col-span-2 text-right">សរុប</span>
          </div>

          <ul className="divide-y divide-gray-100">
            {items.map((item) => {
              const key = item.variantId ? `${item.productId}-${item.variantId}` : item.productId;
              const lineTotal = item.price * item.quantity;
              return (
                <li key={key} className="py-6 grid grid-cols-12 gap-4 items-start">
                  {/* Image */}
                  <div
                    className="col-span-2 aspect-square rounded-sm flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: item.imageColor || "#374151" }}
                  >
                    {item.name.slice(0, 2)}
                  </div>

                  {/* Name / Variant */}
                  <div className="col-span-4">
                    <p className="text-sm font-semibold text-[#0a0a0a] leading-snug">{item.name}</p>
                    {item.variant && (
                      <p className="text-xs text-gray-500 mt-1">{item.variant.color} · {item.variant.size}</p>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemove(item.productId, item.variantId)}
                      className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 mt-2 transition-colors"
                    >
                      <Trash2 size={12} /> លុប
                    </button>
                  </div>

                  {/* Unit price */}
                  <div className="col-span-2 text-center text-sm text-gray-700">
                    ${item.price.toFixed(2)}
                  </div>

                  {/* Quantity */}
                  <div className="col-span-2 flex items-center justify-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => dispatch(updateQuantity({ productId: item.productId, variantId: item.variantId, quantity: item.quantity - 1 }))}
                      disabled={item.quantity <= 1}
                      className="p-1 border border-gray-200 rounded-sm hover:border-gray-400 disabled:opacity-40"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => dispatch(updateQuantity({ productId: item.productId, variantId: item.variantId, quantity: item.quantity + 1 }))}
                      disabled={item.quantity >= item.max}
                      className="p-1 border border-gray-200 rounded-sm hover:border-gray-400 disabled:opacity-40"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* Line total */}
                  <div className="col-span-2 text-right text-sm font-bold text-[#0a0a0a]">
                    ${lineTotal.toFixed(2)}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Order Summary */}
        <aside className="lg:col-span-5">
          <div className="border border-gray-200 rounded-sm p-6 space-y-5 sticky top-24">
            <h2 className="text-base font-bold text-[#0a0a0a]">សង្ខេបការបញ្ជាទិញ</h2>

            <div className="space-y-2.5 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>ការដឹកជញ្ជូន</span>
                <span>
                  {shippingFee === 0
                    ? <span className="text-green-600 font-medium">ឥតគិតថ្លៃ</span>
                    : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              {shippingFee > 0 && (
                <p className="text-xs text-gray-400">
                  ✦ ទទួលការដឹកជញ្ជូន​ ឥតគិតថ្លៃ ពេលបញ្ជាទិញលើស $50
                </p>
              )}
              <div className="flex justify-between font-bold text-base text-[#0a0a0a] pt-3 border-t border-gray-200">
                <span>សរុបទាំងអស់</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="flex items-center justify-center gap-2 w-full bg-[#0a0a0a] text-white text-sm font-bold py-3.5 rounded-sm hover:bg-gray-900 transition-colors"
            >
              <QrCode size={16} /> បន្តទៅ Checkout
            </Link>

            <Link
              href="/products"
              className="flex items-center justify-center gap-2 w-full border border-gray-300 text-sm font-medium py-2.5 rounded-sm text-gray-700 hover:border-gray-500 transition-colors"
            >
              ← បន្តទិញទំនិញ
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

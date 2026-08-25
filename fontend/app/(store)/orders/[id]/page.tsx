"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Package, MapPin, CreditCard, ShieldCheck } from "lucide-react";
import OrderStatusTracker from "@/components/store/OrderStatusTracker";
import { Order } from "@/types";

const MOCK_ORDER: Order = {
  id: "ord1",
  orderNumber: "ORD-92847192",
  status: "SHIPPED",
  paymentStatus: "PAID",
  paymentMethod: "KHQR",
  createdAt: "2026-08-24 14:32",
  subtotal: 138,
  shippingFee: 0,
  discount: 0,
  total: 138,
  shippingAddress: {
    fullName: "Chamreun Vira",
    phone: "013222123",
    address: "St 271, Sangkat Boeung Tumpun",
    city: "Phnom Penh",
    country: "Cambodia",
    isDefault: true,
  },
  orderItems: [
    { productId: "p1", name: "Classic Linen Shirt", quantity: 1, price: 49, imageColor: "#374151" },
    { productId: "p2", name: "Silk Wrap Dress", quantity: 1, price: 89, imageColor: "#831843" },
  ],
};

interface Params { id: string }

export default function OrderDetailPage({ params }: { params: Promise<Params> }) {
  const { id } = use(params);
  const order = MOCK_ORDER; // Replace with API fetch by id

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <Link
        href="/orders"
        className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#0a0a0a] mb-6 transition-colors font-medium"
      >
        <ArrowLeft size={14} /> ត្រឡប់ទៅការបញ្ជាទិញទាំងអស់
      </Link>

      <div className="border border-gray-200 rounded-sm p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">ការបញ្ជាទិញ</span>
            <h1 className="text-xl lg:text-2xl font-extrabold text-[#0a0a0a]">#{order.orderNumber}</h1>
            <p className="text-xs text-gray-500 mt-0.5">បង្កើតនៅ: {order.createdAt}</p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 text-xs font-bold px-3 py-1 rounded-sm">
              <ShieldCheck size={13} /> {order.paymentStatus === "PAID" ? "បានទូទាត់រួច" : "មិនទាន់ទូទាត់"}
            </span>
          </div>
        </div>

        {/* Tracker */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">ស្ថានភាពដឹកជញ្ជូន</h3>
          <OrderStatusTracker status={order.status} />
        </div>

        {/* Shipping & Payment details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <MapPin size={13} /> អាសយដ្ឋានដឹកជញ្ជូន
            </h4>
            <p className="text-sm font-bold text-[#0a0a0a]">{order.shippingAddress.fullName}</p>
            <p className="text-xs text-gray-600">{order.shippingAddress.phone}</p>
            <p className="text-xs text-gray-600">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <CreditCard size={13} /> ការទូទាត់
            </h4>
            <p className="text-sm font-bold text-[#0a0a0a]">វិធីសាស្ត្រ: {order.paymentMethod || "KHQR"}</p>
            <p className="text-xs text-gray-600">ស្ថានភាព: {order.paymentStatus}</p>
          </div>
        </div>

        {/* Items */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">ទំនិញដែលបានបញ្ជាទិញ</h4>
          <ul className="divide-y divide-gray-100">
            {order.orderItems.map((item, idx) => (
              <li key={idx} className="py-3 flex items-center gap-4">
                <div
                  className="h-12 w-10 rounded-sm shrink-0"
                  style={{ backgroundColor: item.imageColor || "#374151" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0a0a0a] truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">ចំនួន: {item.quantity}</p>
                </div>
                <span className="text-sm font-bold text-[#0a0a0a]">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Totals */}
        <div className="border-t border-gray-200 pt-4 space-y-2 text-sm max-w-xs ml-auto text-gray-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>ការដឹកជញ្ជូន</span>
            <span>{order.shippingFee === 0 ? "ឥតគិតថ្លៃ" : `$${order.shippingFee.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between font-black text-base text-[#0a0a0a] pt-2 border-t border-gray-200">
            <span>សរុបទាំងអស់</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Package, ArrowRight, Clock, CheckCircle, Truck, PackageCheck, XCircle } from "lucide-react";
import { Order, OrderStatus } from "@/types";

const MOCK_ORDERS: Order[] = [
  {
    id: "ord1",
    orderNumber: "ORD-92847192",
    status: "SHIPPED",
    paymentStatus: "PAID",
    createdAt: "2026-08-24",
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
      { name: "Classic Linen Shirt", quantity: 1, price: 49 },
      { name: "Silk Wrap Dress", quantity: 1, price: 89 },
    ],
  },
  {
    id: "ord2",
    orderNumber: "ORD-88129401",
    status: "DELIVERED",
    paymentStatus: "PAID",
    createdAt: "2026-08-15",
    subtotal: 120,
    shippingFee: 0,
    discount: 0,
    total: 120,
    shippingAddress: {
      fullName: "Chamreun Vira",
      phone: "013222123",
      address: "St 271, Sangkat Boeung Tumpun",
      city: "Phnom Penh",
      country: "Cambodia",
      isDefault: true,
    },
    orderItems: [{ name: "Leather Tote Bag", quantity: 1, price: 120 }],
  },
];

const STATUS_KHMER: Record<OrderStatus, { label: string; color: string; icon: any }> = {
  PENDING: { label: "កំពុងរង់ចាំ", color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
  CONFIRMED: { label: "បានបញ្ជាក់", color: "bg-blue-50 text-blue-700 border-blue-200", icon: CheckCircle },
  SHIPPED: { label: "កំពុងដឹកជញ្ជូន", color: "bg-purple-50 text-purple-700 border-purple-200", icon: Truck },
  DELIVERED: { label: "បានដឹកដល់", color: "bg-green-50 text-green-700 border-green-200", icon: PackageCheck },
  CANCELLED: { label: "បានបោះបង់", color: "bg-red-50 text-red-700 border-red-200", icon: XCircle },
};

export default function CustomerOrdersPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight mb-8">
        ការបញ្ជាទិញរបស់ខ្ញុំ
      </h1>

      {MOCK_ORDERS.length === 0 ? (
        <div className="py-20 text-center space-y-4 border border-gray-200 rounded-sm">
          <Package size={48} className="mx-auto text-gray-300" />
          <p className="text-lg font-semibold text-[#0a0a0a]">អ្នកមិនទាន់មានការបញ្ជាទិញនៅឡើយទេ</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0a0a0a] text-white text-sm font-bold rounded-sm"
          >
            <ArrowRight size={15} /> ចាប់ផ្ដើមទិញ
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {MOCK_ORDERS.map((order) => {
            const st = STATUS_KHMER[order.status];
            const Icon = st.icon;
            return (
              <div
                key={order.id}
                className="border border-gray-200 rounded-sm p-6 hover:border-gray-400 transition-colors space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider block">លេខការបញ្ជាទិញ</span>
                    <span className="text-sm font-extrabold text-[#0a0a0a]">#{order.orderNumber}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400 block">កាលបរិច្ឆេទ</span>
                    <span className="text-xs font-semibold text-gray-700">{order.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 border text-xs font-bold rounded-sm ${st.color}`}>
                      <Icon size={13} /> {st.label}
                    </span>
                  </div>
                </div>

                {/* Items preview */}
                <div className="space-y-2">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-700 font-medium">{item.name} × {item.quantity}</span>
                      <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <span className="text-xs text-gray-500">សរុបទាំងអស់: </span>
                    <span className="text-base font-extrabold text-[#0a0a0a]">${order.total.toFixed(2)}</span>
                  </div>
                  <Link
                    href={`/orders/${order.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-[#0a0a0a] text-xs font-bold text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white rounded-sm transition-colors"
                  >
                    មើលព័ត៌មានលម្អិត →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

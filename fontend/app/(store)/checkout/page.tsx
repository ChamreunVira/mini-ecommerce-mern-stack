"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, QrCode, MapPin, ChevronRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { clearCart } from "@/store/slices/cartSlice";
import { showToast } from "@/store/slices/uiSlice";
import { IAddress } from "@/types";

type Step = "address" | "payment" | "confirm";
type PaymentMethod = "KHQR" | "COD";

const STEPS = [
  { key: "address", label: "01 អាសយដ្ឋាន" },
  { key: "payment", label: "02 ការទូទាត់" },
  { key: "confirm", label: "03 បញ្ជាក់" },
];

function KHQRModal({ total, onConfirm, onClose }: { total: number; onConfirm: () => void; onClose: () => void }) {
  const [paid, setPaid] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-white w-full max-w-sm rounded-sm p-6 space-y-5">
        <div className="text-center space-y-1">
          <QrCode size={48} className="mx-auto text-[#0a0a0a]" />
          <h3 className="text-lg font-extrabold">ការទូទាត់តាម KHQR</h3>
          <p className="text-2xl font-black text-[#0a0a0a]">${total.toFixed(2)}</p>
        </div>

        {/* Mock QR code visual */}
        <div className="mx-auto w-48 h-48 bg-gray-100 border border-gray-200 rounded-sm flex flex-col items-center justify-center gap-2 p-3">
          <div className="grid grid-cols-5 gap-0.5 w-full h-full">
            {Array.from({ length: 25 }).map((_, i) => (
              <div
                key={i}
                className="rounded-[2px]"
                style={{ backgroundColor: Math.random() > 0.5 ? "#0a0a0a" : "#f3f4f6" }}
              />
            ))}
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>Bakong · National Bank of Cambodia</p>
          <p className="font-bold text-[#0a0a0a]">vSt4reKH Merchant</p>
          <p className="font-mono text-xs">TXN-{Date.now().toString().slice(-8)}</p>
        </div>

        {!paid ? (
          <button
            type="button"
            onClick={() => setPaid(true)}
            className="w-full py-3 bg-[#0a0a0a] text-white text-sm font-bold rounded-sm hover:bg-gray-900 transition-colors"
          >
            បញ្ជាក់ការទូទាត់ KHQR ✓
          </button>
        ) : (
          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-3 bg-green-600 text-white text-sm font-bold rounded-sm flex items-center justify-center gap-2"
          >
            <Check size={16} /> បានទូទាត់ — បន្តបញ្ជាទិញ
          </button>
        )}
        <button type="button" onClick={onClose} className="w-full text-sm text-gray-500 underline">
          បោះបង់
        </button>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, subtotal, shippingFee, total } = useAppSelector((s) => s.cart);

  const [step, setStep] = useState<Step>("address");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("KHQR");
  const [showKHQR, setShowKHQR] = useState(false);

  const [addr, setAddr] = useState<IAddress>({
    fullName: "",
    phone: "",
    address: "",
    city: "Phnom Penh",
    province: "Phnom Penh",
    country: "Cambodia",
    isDefault: false,
  });

  const handleConfirmOrder = () => {
    setShowKHQR(false);
    dispatch(clearCart());
    dispatch(showToast({ message: "ការបញ្ជាទិញត្រូវបានបង្កើតដោយជោគជ័យ!" }));
    router.push("/checkout/success");
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === "KHQR") {
      setShowKHQR(true);
    } else {
      handleConfirmOrder();
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center space-y-4">
        <p className="text-lg font-semibold">មិនមានផលិតផលក្នុងកន្ត្រកទេ</p>
        <a href="/products" className="inline-block px-5 py-2.5 bg-[#0a0a0a] text-white text-sm font-bold rounded-sm">
          ចំណាប់ផ្ដើមទិញ
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Checkout Steps indicator */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-sm border ${
                  step === s.key
                    ? "bg-[#0a0a0a] text-white border-[#0a0a0a]"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                {s.label}
              </span>
              {i < STEPS.length - 1 && <ChevronRight size={14} className="text-gray-300" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left — Form */}
          <div className="lg:col-span-7 space-y-8">
            {/* ADDRESS STEP */}
            {step === "address" && (
              <section className="space-y-5">
                <h2 className="text-lg font-extrabold flex items-center gap-2">
                  <MapPin size={18} /> អាសយដ្ឋានដឹកជញ្ជូន
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">ឈ្មោះពេញ *</label>
                    <input
                      type="text"
                      value={addr.fullName}
                      onChange={(e) => setAddr({ ...addr, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-300 text-sm rounded-sm focus:outline-none focus:border-[#0a0a0a] transition-colors"
                      placeholder="ឧ. ចន្ទ ពិសី"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">លេខទូរស័ព្ទ *</label>
                    <input
                      type="text"
                      value={addr.phone}
                      onChange={(e) => setAddr({ ...addr, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-300 text-sm rounded-sm focus:outline-none focus:border-[#0a0a0a] transition-colors"
                      placeholder="ឧ. 012 345 678"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">អាសយដ្ឋាន *</label>
                    <input
                      type="text"
                      value={addr.address}
                      onChange={(e) => setAddr({ ...addr, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-300 text-sm rounded-sm focus:outline-none focus:border-[#0a0a0a] transition-colors"
                      placeholder="ឧ. St 271, Sangkat Boeung Tumpun"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">ក្រុង</label>
                    <input
                      type="text"
                      value={addr.city}
                      onChange={(e) => setAddr({ ...addr, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-300 text-sm rounded-sm focus:outline-none focus:border-[#0a0a0a] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1.5">ខេត្ត/ស្រុក</label>
                    <input
                      type="text"
                      value={addr.province || ""}
                      onChange={(e) => setAddr({ ...addr, province: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-300 text-sm rounded-sm focus:outline-none focus:border-[#0a0a0a] transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep("payment")}
                  disabled={!addr.fullName || !addr.phone || !addr.address}
                  className="px-8 py-3 bg-[#0a0a0a] text-white text-sm font-bold rounded-sm hover:bg-gray-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  បន្ត → ការទូទាត់
                </button>
              </section>
            )}

            {/* PAYMENT STEP */}
            {step === "payment" && (
              <section className="space-y-5">
                <h2 className="text-lg font-extrabold flex items-center gap-2">
                  <QrCode size={18} /> ជ្រើសរើសវិធីទូទាត់
                </h2>

                <div className="space-y-3">
                  {(["KHQR", "COD"] as PaymentMethod[]).map((method) => (
                    <label
                      key={method}
                      className={`flex items-center gap-4 p-4 border-2 cursor-pointer transition-colors rounded-sm ${
                        paymentMethod === method ? "border-[#0a0a0a]" : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={() => setPaymentMethod(method)}
                        className="accent-[#0a0a0a]"
                      />
                      <div>
                        <p className="text-sm font-bold text-[#0a0a0a]">
                          {method === "KHQR" ? "ការទូទាត់ KHQR" : "ទូទាត់នៅពេលទំនិញដល់ (COD)"}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {method === "KHQR"
                            ? "ស្កែន QR Code ប្រើ Bakong, ABA, ACLEDA"
                            : "ទូទាត់ជាសាច់ប្រាក់ពេលទំនិញដល់ផ្ទះ"}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep("address")}
                    className="px-5 py-2.5 border border-gray-300 text-sm font-medium rounded-sm hover:border-gray-500 transition-colors"
                  >
                    ← ត្រឡប់ក្រោយ
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("confirm")}
                    className="px-8 py-2.5 bg-[#0a0a0a] text-white text-sm font-bold rounded-sm hover:bg-gray-900 transition-colors"
                  >
                    បន្ត → ពិនិត្យការបញ្ជាទិញ
                  </button>
                </div>
              </section>
            )}

            {/* CONFIRM STEP */}
            {step === "confirm" && (
              <section className="space-y-6">
                <h2 className="text-lg font-extrabold">ពិនិត្យការបញ្ជាទិញ</h2>

                <div className="border border-gray-200 rounded-sm p-4 space-y-2 text-sm">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-3">អាសយដ្ឋានដឹកជញ្ជូន</h3>
                  <p className="font-semibold">{addr.fullName}</p>
                  <p className="text-gray-600">{addr.phone}</p>
                  <p className="text-gray-600">{addr.address}, {addr.city}, {addr.province}</p>
                </div>

                <div className="border border-gray-200 rounded-sm p-4 text-sm">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-3">ផលិតផល</h3>
                  <ul className="space-y-2">
                    {items.map((item) => (
                      <li key={item.productId} className="flex justify-between">
                        <span>{item.name} × {item.quantity}</span>
                        <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep("payment")}
                    className="px-5 py-2.5 border border-gray-300 text-sm font-medium rounded-sm hover:border-gray-500"
                  >
                    ← ត្រឡប់ក្រោយ
                  </button>
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    className="flex-1 py-3.5 bg-[#0a0a0a] text-white text-sm font-bold rounded-sm hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                  >
                    <QrCode size={16} /> បញ្ជាក់ការបញ្ជាទិញ
                  </button>
                </div>
              </section>
            )}
          </div>

          {/* Right — Order Summary */}
          <aside className="lg:col-span-5">
            <div className="border border-gray-200 rounded-sm p-5 space-y-4 sticky top-24">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">សង្ខេបការបញ្ជាទិញ</h2>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.productId} className="flex items-center gap-3">
                    <div
                      className="h-12 w-10 rounded-sm shrink-0"
                      style={{ backgroundColor: item.imageColor || "#374151" }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">× {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-gray-100 pt-3 space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>ការដឹកជញ្ជូន</span>
                  <span>{shippingFee === 0 ? <span className="text-green-600">ឥតគិតថ្លៃ</span> : `$${shippingFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between font-extrabold text-base text-[#0a0a0a] pt-2 border-t border-gray-100">
                  <span>សរុប</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {showKHQR && (
        <KHQRModal
          total={total}
          onConfirm={handleConfirmOrder}
          onClose={() => setShowKHQR(false)}
        />
      )}
    </>
  );
}

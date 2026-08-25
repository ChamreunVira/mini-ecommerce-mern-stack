"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Phone, ArrowRight } from "lucide-react";
import { useAppDispatch } from "@/store/store";
import { setCredentials } from "@/store/slices/authSlice";
import { showToast } from "@/store/slices/uiSlice";

export default function StoreRegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    telephone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      dispatch(showToast({ message: "ពាក្យសម្ងាត់មិនត្រូវគ្នាទេ!", type: "error" }));
      return;
    }

    setLoading(true);
    setTimeout(() => {
      dispatch(
        setCredentials({
          token: "mock-jwt-token-register",
          user: {
            id: `u-${Date.now()}`,
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            telephone: form.telephone,
            role: "CUSTOMER",
            isAdmin: false,
            avatar: null,
            addresses: [],
          },
        }),
      );
      dispatch(showToast({ message: "ការចុះឈ្មោះបានជោគជ័យ!" }));
      setLoading(false);
      router.push("/");
    }, 600);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg border border-gray-200 rounded-sm p-8 space-y-6 bg-white">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black text-[#0a0a0a] tracking-tight">បង្កើតគណនីថ្មី</h1>
          <p className="text-xs text-gray-500">បញ្ចូលព័ត៌មានខាងក្រោមដើម្បីចុះឈ្មោះ</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">នាមត្រកូល *</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  required
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  placeholder="ចន្ទ"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 text-sm rounded-sm focus:outline-none focus:border-[#0a0a0a]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">ឈ្មោះ *</label>
              <input
                type="text"
                required
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                placeholder="ពិសី"
                className="w-full px-3 py-2.5 border border-gray-300 text-sm rounded-sm focus:outline-none focus:border-[#0a0a0a]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">អ៊ីមែល *</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="yourname@example.com"
                className="w-full pl-9 pr-3.5 py-2.5 border border-gray-300 text-sm rounded-sm focus:outline-none focus:border-[#0a0a0a]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">លេខទូរស័ព្ទ</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="tel"
                value={form.telephone}
                onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                placeholder="012 345 678"
                className="w-full pl-9 pr-3.5 py-2.5 border border-gray-300 text-sm rounded-sm focus:outline-none focus:border-[#0a0a0a]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">ពាក្យសម្ងាត់ *</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 text-sm rounded-sm focus:outline-none focus:border-[#0a0a0a]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">បញ្ជាក់ពាក្យសម្ងាត់ *</label>
              <input
                type="password"
                required
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 border border-gray-300 text-sm rounded-sm focus:outline-none focus:border-[#0a0a0a]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0a0a0a] text-white text-sm font-bold rounded-sm hover:bg-gray-900 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "កំពុងបង្កើត..." : "បង្កើតគណនី"} <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center border-t border-gray-100 pt-4 text-xs text-gray-500">
          មានគណនីរួចហើយមែនទេ?{" "}
          <Link href="/login" className="font-bold text-[#0a0a0a] hover:underline">
            ចូលប្រើប្រាស់
          </Link>
        </div>
      </div>
    </div>
  );
}

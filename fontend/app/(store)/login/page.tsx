"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { useAppDispatch } from "@/store/store";
import { setCredentials } from "@/store/slices/authSlice";
import { showToast } from "@/store/slices/uiSlice";

export default function StoreLoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      dispatch(
        setCredentials({
          token: "mock-jwt-token-12345",
          user: {
            id: "u1",
            firstName: "Chamreun",
            lastName: "Vira",
            email: email || "boththann76@gmail.com",
            role: "CUSTOMER",
            isAdmin: false,
            avatar: null,
            addresses: [],
          },
        }),
      );
      dispatch(showToast({ message: "ចូលប្រើប្រាស់បានជោគជ័យ!" }));
      setLoading(false);
      router.push("/");
    }, 600);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md border border-gray-200 rounded-sm p-8 space-y-6 bg-white">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black text-[#0a0a0a] tracking-tight">ចូលប្រើប្រាស់</h1>
          <p className="text-xs text-gray-500">បញ្ចូលអ៊ីមែល និងពាក្យសម្ងាត់របស់អ្នកដើម្បីចូលគណនី</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">អ៊ីមែល *</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@example.com"
                className="w-full pl-9 pr-3.5 py-2.5 border border-gray-300 text-sm rounded-sm focus:outline-none focus:border-[#0a0a0a] transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-gray-600">ពាក្យសម្ងាត់ *</label>
              <a href="#" className="text-xs text-gray-500 hover:underline">ភ្លេចពាក្យសម្ងាត់?</a>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 border border-gray-300 text-sm rounded-sm focus:outline-none focus:border-[#0a0a0a] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0a0a0a] text-white text-sm font-bold rounded-sm hover:bg-gray-900 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "កំពុងដំណើរការ..." : "ចូលប្រើប្រាស់"} <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center border-t border-gray-100 pt-4 text-xs text-gray-500">
          មិនទាន់មានគណនីមែនទេ?{" "}
          <Link href="/register" className="font-bold text-[#0a0a0a] hover:underline">
            ចុះឈ្មោះទីនេះ
          </Link>
        </div>
      </div>
    </div>
  );
}

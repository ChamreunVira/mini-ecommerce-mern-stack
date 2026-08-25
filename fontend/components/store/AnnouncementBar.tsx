"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useState } from "react";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative bg-[#0a0a0a] text-white text-center py-2.5 px-4">
      <p className="text-xs font-medium tracking-wide">
        🚚 ដឹកជញ្ជូនឥតគិតថ្លៃ សម្រាប់ការបញ្ជាទិញចាប់ពី $50{" "}
        <Link href="/products" className="underline underline-offset-2 hover:text-gray-300 ml-1">
          ទិញឥឡូវ →
        </Link>
      </p>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
        aria-label="Close announcement"
      >
        <X size={14} />
      </button>
    </div>
  );
}

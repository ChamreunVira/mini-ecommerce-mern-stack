"use client";

import Link from "next/link";

const COLS = [
  {
    title: "ហាង",
    links: [
      { label: "ផលិតផល", href: "/products" },
      { label: "ផលិតផលថ្មី", href: "/products?filter=newest" },
      { label: "Sale", href: "/products?filter=sale" },
      { label: "ផលិតផលពេញនិយម", href: "/products?filter=top" },
    ],
  },
  {
    title: "ជំនួយ",
    links: [
      { label: "ទាក់ទងយើង", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "ការដឹកជញ្ជូន", href: "/shipping" },
      { label: "ការត្រឡប់ទំនិញ", href: "/returns" },
    ],
  },
  {
    title: "គណនី",
    links: [
      { label: "Profile", href: "/profile" },
      { label: "ការបញ្ជាទិញ", href: "/orders" },
      { label: "បញ្ជីចំណូលចិត្ត", href: "/wishlist" },
    ],
  },
];

export default function StoreFooter() {
  return (
    <footer className="border-t border-gray-200 bg-[#0a0a0a] text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="font-extrabold text-2xl text-white tracking-tight">
              vSt4reKH
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              ហាងទំនុញ្ចចិត្ត ជាមួយផលិតផលប្រចាំថ្ងៃ ពីក្នុងប្រទេស និងអន្តរជាតិ។
            </p>
            <div className="flex items-center gap-2 pt-2">
              <div className="flex items-center gap-1.5 border border-gray-700 rounded px-2.5 py-1.5">
                <span className="text-[10px] font-bold text-white tracking-wider">KHQR</span>
                <span className="text-[10px] text-gray-500">Bakong</span>
              </div>
            </div>
          </div>

          {/* Nav Columns */}
          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="text-white text-sm font-semibold mb-4 tracking-wide">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">© 2026 vSt4reKH. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

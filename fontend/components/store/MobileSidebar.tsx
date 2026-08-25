"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Package, User, MapPin, Heart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setMobileMenuOpen } from "@/store/slices/uiSlice";

const STORE_NAV = [
  { href: "/", label: "ទំព័រដើម" },
  { href: "/products?category=Men", label: "បុរស" },
  { href: "/products?category=Women", label: "នារី" },
  { href: "/products?category=Accessories", label: "Accessories" },
  { href: "/products?filter=newest", label: "ផលិតផលថ្មី" },
  { href: "/products?filter=sale", label: "Sale" },
];

export default function MobileSidebar() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isOpen = useAppSelector((s) => s.ui.mobileMenuOpen);
  const { currentUser } = useAppSelector((s) => s.auth);

  const close = () => dispatch(setMobileMenuOpen(false));

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <Link href="/" onClick={close} className="font-extrabold text-xl tracking-tight text-[#0a0a0a]">
            vSt4reKH
          </Link>
          <button type="button" onClick={close} className="p-1 text-gray-500 hover:text-[#0a0a0a]">
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          <p className="px-3 py-2 text-[10px] font-bold tracking-widest text-gray-400 uppercase">ហាង</p>
          {STORE_NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className={`flex items-center px-3 py-2.5 text-sm rounded-md transition-colors ${
                  active
                    ? "bg-[#0a0a0a] text-white font-semibold"
                    : "text-gray-700 hover:bg-gray-100 hover:text-[#0a0a0a]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-gray-100 mt-4">
            <p className="px-3 py-2 text-[10px] font-bold tracking-widest text-gray-400 uppercase">គណនី</p>
            <Link href="/profile" onClick={close} className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
              <User size={16} /> Profile
            </Link>
            <Link href="/orders" onClick={close} className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
              <Package size={16} /> ការបញ្ជាទិញ
            </Link>
            <Link href="/wishlist" onClick={close} className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
              <Heart size={16} /> បញ្ជីចំណូលចិត្ត
            </Link>
            <Link href="/profile/addresses" onClick={close} className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
              <MapPin size={16} /> អាសយដ្ឋាន
            </Link>
          </div>

          {currentUser?.role === "ADMIN" && (
            <div className="pt-3 border-t border-gray-100 mt-3">
              <Link href="/admin/dashboard" onClick={close} className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-amber-700 font-medium hover:bg-amber-50 rounded-md">
                Admin Dashboard
              </Link>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}

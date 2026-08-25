"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ShoppingBag, Search, Menu, User, Heart, Package, ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setDrawerOpen } from "@/store/slices/cartSlice";
import { setSearchOpen, setMobileMenuOpen } from "@/store/slices/uiSlice";

const NAV = [
  { href: "/", label: "ទំព័រដើម" },
  { href: "/products?category=Men", label: "បុរស" },
  { href: "/products?category=Women", label: "នារី" },
  { href: "/products?category=Accessories", label: "Accessories" },
  { href: "/products?filter=newest", label: "ផលិតផលថ្មី" },
  { href: "/products?filter=sale", label: "Sale" },
];

export default function StoreHeader() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const totalItems = useAppSelector((s) => s.cart.totalItems);
  const wishlistCount = useAppSelector((s) => s.wishlist.items.length);
  const { currentUser } = useAppSelector((s) => s.auth);

  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("?")[0]) || pathname.includes(href.split("?")[1] ?? "__");
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 lg:h-16">

          {/* Left — Mobile Menu + Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => dispatch(setMobileMenuOpen(true))}
              className="lg:hidden p-1.5 text-gray-600 hover:text-[#0a0a0a]"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <Link href="/" className="font-extrabold text-lg tracking-tight text-[#0a0a0a]">
              vSt4reKH
            </Link>
          </div>

          {/* Center — Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition-colors border-b-2 py-0.5 ${
                  isActive(item.href)
                    ? "border-[#0a0a0a] text-[#0a0a0a] font-semibold"
                    : "border-transparent text-gray-600 hover:text-[#0a0a0a]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right — Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Search */}
            <button
              type="button"
              onClick={() => dispatch(setSearchOpen(true))}
              className="p-2 text-gray-600 hover:text-[#0a0a0a] transition-colors"
              aria-label="ស្វែងរក"
            >
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <Link href="/wishlist" className="relative p-2 text-gray-600 hover:text-[#0a0a0a] transition-colors hidden sm:flex">
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#0a0a0a] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              type="button"
              onClick={() => dispatch(setDrawerOpen(true))}
              className="relative p-2 text-gray-600 hover:text-[#0a0a0a] transition-colors"
              aria-label="កន្ត្រក"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-[#0a0a0a] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-1.5 p-1.5 text-gray-600 hover:text-[#0a0a0a] transition-colors"
              >
                <User size={20} />
                <ChevronDown size={14} className="hidden sm:block" />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-20">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-xs font-semibold text-[#0a0a0a] truncate">
                        {currentUser?.firstName} {currentUser?.lastName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{currentUser?.email}</p>
                    </div>
                    <Link href="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <User size={15} /> Profile
                    </Link>
                    <Link href="/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <Package size={15} /> ការបញ្ជាទិញ
                    </Link>
                    <Link href="/wishlist" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <Heart size={15} /> បញ្ជីចំណូលចិត្ត
                    </Link>
                    {currentUser?.role === "ADMIN" && (
                      <Link href="/admin/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-amber-700 hover:bg-amber-50">
                        <LayoutDashboard size={15} /> Admin Dashboard
                      </Link>
                    )}
                    <div className="border-t border-gray-100 mt-1">
                      <Link href="/login" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                        <LogOut size={15} /> ចេញ
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

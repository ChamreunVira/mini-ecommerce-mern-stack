"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FolderTree,
  ShoppingBag,
  Store,
  ChevronRight,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Products", href: "/dashboard/products", icon: Package },
    { label: "Add Product", href: "/dashboard/products/new", icon: PlusCircle },
    { label: "Categories", href: "/dashboard/categories", icon: FolderTree },
    { label: "Recent Orders", href: "/dashboard/orders", icon: ShoppingBag },
  ];

  return (
    <aside className="w-64 border-r border-border bg-white flex flex-col justify-between h-[calc(100vh-61px)] sticky top-[61px] shrink-0 hidden md:flex">
      <div className="p-4 space-y-6">
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-ink/40">
            Admin Management
          </p>
          <nav className="mt-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-ink/70 hover:bg-surface hover:text-ink"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={isActive ? "text-primary" : "text-ink/50"} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight size={14} className="text-white/60" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-ink/40">
            Storefront
          </p>
          <nav className="mt-2 space-y-1">
            <Link
              href="/"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-ink/70 hover:bg-surface hover:text-ink transition-colors"
            >
              <Store size={16} className="text-ink/50" />
              Back to Storefront
            </Link>
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-border bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 font-bold text-white text-xs">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-ink truncate">Admin Manager</p>
            <p className="text-[11px] text-ink/50 truncate">admin@marlo.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

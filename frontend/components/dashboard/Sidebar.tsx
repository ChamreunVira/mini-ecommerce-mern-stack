"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Tag,
  Image,
  Settings,
  Store,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navGroups = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: "Catalog",
    items: [
      { label: "Products", href: "/dashboard/products", icon: Package, exact: false },
      { label: "Categories", href: "/dashboard/categories", icon: FolderTree, exact: false },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Orders", href: "/dashboard/orders", icon: ShoppingBag, exact: false },
      { label: "Users", href: "/dashboard/users", icon: Users, exact: false },
    ],
  },
  {
    label: "Marketing",
    items: [
      { label: "Coupons", href: "/dashboard/coupons", icon: Tag, exact: false },
      { label: "Banners", href: "/dashboard/banners", icon: Image, exact: false },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Settings", href: "/dashboard/settings", icon: Settings, exact: false },
    ],
  },
];

function SidebarContent({ pathname, onClose }: { pathname: string; onClose?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo / Brand */}
      <div className="flex items-center justify-between border-b border-border px-4 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white font-bold text-xs">
            M
          </div>
          <div>
            <p className="text-xs font-bold text-ink">Marlo Admin</p>
            <p className="text-[10px] text-ink/40">Store Manager</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-ink/50 hover:text-ink lg:hidden">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-ink/35">
              {group.label}
            </p>
            <nav className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-ink/70 hover:bg-surface hover:text-ink"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        size={15}
                        className={isActive ? "text-primary" : "text-ink/40"}
                      />
                      {item.label}
                    </div>
                    {isActive && <ChevronRight size={13} className="text-white/50" />}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}

        {/* Back to storefront */}
        <div>
          <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-ink/35">
            Storefront
          </p>
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-ink/70 hover:bg-surface hover:text-ink transition-all"
          >
            <Store size={15} className="text-ink/40" />
            View Storefront
          </Link>
        </div>
      </div>

      {/* Admin profile */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-xl bg-surface px-3 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
            AD
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-ink">Admin Manager</p>
            <p className="truncate text-[10px] text-ink/50">admin@marlo.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-[70px] z-40 flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-white shadow-sm text-ink/70 hover:text-ink lg:hidden"
      >
        <Menu size={18} />
      </button>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent pathname={pathname} onClose={() => setMobileOpen(false)} />
      </div>

      {/* Desktop sidebar */}
      <aside className="sticky top-[61px] hidden h-[calc(100vh-61px)] w-60 shrink-0 flex-col border-r border-border bg-white lg:flex">
        <SidebarContent pathname={pathname} />
      </aside>
    </>
  );
}

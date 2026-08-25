"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Boxes,
  LayoutGrid,
  Ticket,
  FileText,
  Users,
  Tv,
  Settings,
  LogOut,
  LucideIcon,
} from "lucide-react";
import { useAppSelector } from "@/store/store";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: Home },
  { href: "/admin/products", label: "Products", icon: Boxes },
  { href: "/admin/collections", label: "Collections", icon: LayoutGrid },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/orders", label: "Orders", icon: FileText },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/banners", label: "Banners", icon: Tv },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  open?: boolean;
  onNavigate?: () => void;
}

export default function Sidebar({ open = true, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const initial = currentUser?.firstName?.[0] ?? "?";

  return (
    <aside
      className={`h-screen shrink-0 border-r border-gray-200 bg-[#fafafa] flex flex-col justify-between transition-[width] duration-200 ${
        open ? "w-72" : "w-0 overflow-hidden border-r-0"
      }`}
    >
      <div>
        <div className="h-[73px] flex items-center px-7 border-b border-gray-200">
          <Link href="/dashboard" className="flex items-center gap-0.5">
            <span className="text-2xl font-extrabold tracking-tight text-ink">
              kdmv
            </span>
            <span className="mb-3 h-1.5 w-1.5 rounded-full bg-blue-500" />
          </Link>
        </div>

        <nav className="px-4 py-5 flex flex-col gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href || (href !== "/dashboard" && pathname?.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={onNavigate}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-[15px] transition-colors ${
                  active
                    ? "bg-gray-100 text-ink font-semibold"
                    : "text-gray-600 hover:bg-gray-100/70 hover:text-ink font-medium"
                }`}
              >
                <Icon
                  size={19}
                  strokeWidth={active ? 2.25 : 1.75}
                  className="shrink-0"
                />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 flex items-center gap-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
          {initial}
        </div>
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-ink py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}

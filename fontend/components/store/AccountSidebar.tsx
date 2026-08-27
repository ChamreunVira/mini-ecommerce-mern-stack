"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, MapPin, Package, Heart } from "lucide-react";

const NAV_ITEMS = [
  { href: "/profile", label: "ព័ត៌មានផ្ទាល់ខ្លួន", icon: User },
  { href: "/profile/addresses", label: "អាសយដ្ឋាន", icon: MapPin },
  { href: "/orders", label: "ការបញ្ជាទិញ", icon: Package },
  { href: "/wishlist", label: "បញ្ជីចំណូលចិត្ត", icon: Heart },
];

function isActive(pathname: string, href: string) {
  // "/profile" must match exactly so it doesn't light up on "/profile/addresses"
  if (href === "/profile") return pathname === "/profile";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <aside className="lg:col-span-3 space-y-1">
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 px-4 py-3 text-sm rounded-sm transition-colors ${
              active
                ? "bg-[#0a0a0a] text-white font-semibold"
                : "text-gray-700 font-medium hover:bg-gray-100"
            }`}
          >
            <Icon size={16} /> {item.label}
          </Link>
        );
      })}
    </aside>
  );
}
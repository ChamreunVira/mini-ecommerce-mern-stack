import Link from "next/link";
import { Search, User, ShoppingCart } from "lucide-react";
import { categories } from "@/lib/data";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-border">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3 sm:px-6">
        <Link href="/" className="font-display text-xl font-bold text-ink shrink-0">
          Marlo
        </Link>

        <div className="hidden flex-1 items-center rounded-card border border-border bg-surface px-3 py-2 md:flex">
          <Search size={16} className="text-ink/40" />
          <input
            type="search"
            placeholder="Search for products..."
            className="ml-2 w-full bg-transparent text-sm outline-none placeholder:text-ink/40"
          />
        </div>

        <nav className="ml-auto flex items-center gap-5 shrink-0">
          <Link href="/account" className="hidden items-center gap-1.5 text-sm text-ink/80 hover:text-ink sm:flex">
            <User size={18} />
            Login
          </Link>
          <Link href="/cart" className="relative flex items-center gap-1.5 text-sm text-ink/80 hover:text-ink">
            <ShoppingCart size={18} />
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
              3
            </span>
          </Link>
        </nav>
      </div>

      <div className="mx-auto hidden max-w-7xl gap-6 border-t border-border px-4 py-2.5 text-sm sm:px-6 md:flex">
        <Link href="/category/all" className="font-medium text-ink hover:text-primary">
          Categories
        </Link>
        {categories.map((c) => (
          <Link key={c.id} href={`/category/${c.slug}`} className="text-ink/70 hover:text-primary">
            {c.name}
          </Link>
        ))}
        <Link href="/category/all" className="ml-auto text-ink/70 hover:text-primary">
          Deals
        </Link>
      </div>
    </header>
  );
}

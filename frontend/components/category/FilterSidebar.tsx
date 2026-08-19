import Link from "next/link";
import { categories } from "@/lib/data";

const priceRanges = ["$0 - $25", "$25 - $50", "$50 - $100", "$100 - $150", "$150+"];
const sizes = ["S", "M", "L", "XL"];

export default function FilterSidebar({ activeSlug }: { activeSlug: string }) {
  return (
    <aside className="hidden w-56 shrink-0 space-y-8 md:block">
      <div>
        <h3 className="text-sm font-semibold text-ink">Category</h3>
        <ul className="mt-3 space-y-2">
          {categories.map((c) => (
            <li key={c.id}>
              <Link
                href={`/category/${c.slug}`}
                className={`text-sm ${
                  activeSlug === c.slug ? "font-medium text-primary" : "text-ink/60 hover:text-primary"
                }`}
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-ink">Price</h3>
        <ul className="mt-3 space-y-2">
          {priceRanges.map((range) => (
            <li key={range} className="flex items-center gap-2">
              <input type="checkbox" id={range} className="h-4 w-4 rounded border-border text-primary" />
              <label htmlFor={range} className="text-sm text-ink/70">
                {range}
              </label>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="mt-4 w-full rounded-card bg-primary py-2 text-sm font-medium text-white hover:bg-primary-hover"
        >
          Apply
        </button>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-ink">Size</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              className="h-9 w-9 rounded-card border border-border text-sm text-ink/70 hover:border-primary hover:text-primary"
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

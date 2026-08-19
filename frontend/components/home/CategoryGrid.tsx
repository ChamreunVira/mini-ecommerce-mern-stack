import Link from "next/link";
import Image from "next/image";
import { categories } from "@/lib/data";

export default function CategoryGrid() {
  return (
    <section>
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl font-bold text-ink">Shop by Category</h2>
        <Link href="/category/all" className="text-sm text-primary hover:underline">
          View all
        </Link>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-5">
        {categories.map((c) => (
          <Link key={c.id} href={`/category/${c.slug}`} className="group text-center">
            <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-card bg-surface">
              <Image
                src={c.image}
                alt={c.name}
                fill
                sizes="150px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <p className="mt-2 text-sm font-medium text-ink">{c.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

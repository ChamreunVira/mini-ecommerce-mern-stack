import { notFound } from "next/navigation";
import Breadcrumb from "@/components/ui/Breadcrumb";
import FilterSidebar from "@/components/category/FilterSidebar";
import SortBar from "@/components/category/SortBar";
import ProductCard from "@/components/product/ProductCard";
import { categories, getCategoryBySlug, getProductsByCategory } from "@/lib/data";

export function generateStaticParams() {
  return [{ slug: "all" }, ...categories.map((c) => ({ slug: c.slug }))];
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const isAll = params.slug === "all";
  const category = isAll ? undefined : getCategoryBySlug(params.slug);

  if (!isAll && !category) notFound();

  const items = getProductsByCategory(params.slug);
  const title = isAll ? "All Products" : category!.name;

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Categories", href: "/category/all" }, { label: title }]}
      />

      <div className="overflow-hidden rounded-card bg-surface px-6 py-8 sm:px-10">
        <h1 className="text-2xl font-bold text-ink">{title}</h1>
        <p className="mt-1 text-sm text-ink/60">
          {isAll ? "Explore every product across Marlo's sellers" : `Explore our exclusive collection for ${title}`}
        </p>
      </div>

      <div className="flex gap-8">
        <FilterSidebar activeSlug={params.slug} />
        <div className="flex-1 space-y-4">
          <SortBar count={items.length} />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {items.length === 0 && (
            <p className="py-12 text-center text-sm text-ink/50">No products in this category yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

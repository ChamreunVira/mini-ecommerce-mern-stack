import Link from "next/link";
import { Product } from "@/types/product";
import ProductCard from "@/components/product/ProductCard";

interface ProductSectionProps {
  title: string;
  products: Product[];
  viewAllHref?: string;
}

export default function ProductSection({ title, products, viewAllHref }: ProductSectionProps) {
  return (
    <section>
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl font-bold text-ink">{title}</h2>
        {viewAllHref && (
          <Link href={viewAllHref} className="text-sm text-primary hover:underline">
            View all
          </Link>
        )}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

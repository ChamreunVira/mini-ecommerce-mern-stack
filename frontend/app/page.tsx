import Hero from "@/components/home/Hero";
import FeatureStrip from "@/components/home/FeatureStrip";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProductSection from "@/components/home/ProductSection";
import { getBestSellers } from "@/lib/data";

export default function HomePage() {
  const bestSellers = getBestSellers(4);

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-6 sm:px-6">
      <Hero />
      <FeatureStrip />
      <CategoryGrid />
      <ProductSection title="Best Selling Products" products={bestSellers} viewAllHref="/category/all" />
    </div>
  );
}

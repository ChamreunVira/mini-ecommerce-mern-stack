import { notFound } from "next/navigation";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import FeatureStrip from "@/components/home/FeatureStrip";
import ProductSection from "@/components/home/ProductSection";
import { getProductBySlug, getRelatedProducts, products, getCategoryBySlug } from "@/lib/data";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.slug }));
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = getProductBySlug(params.id);
  if (!product) notFound();

  const category = getCategoryBySlug(product.category);
  const related = getRelatedProducts(product, 4);

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-6 sm:px-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          ...(category ? [{ label: category.name, href: `/category/${category.slug}` }] : []),
          { label: product.name },
        ]}
      />

      <div className="grid gap-10 md:grid-cols-2">
        <ProductGallery images={product.images ?? [product.image]} name={product.name} />
        <ProductInfo product={product} />
      </div>

      <FeatureStrip />

      <ProductTabs product={product} />

      <ProductSection title="You may also like" products={related} />
    </div>
  );
}

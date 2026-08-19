import CartView from "@/components/cart/CartView";
import ProductSection from "@/components/home/ProductSection";
import { getBestSellers } from "@/lib/data";

export default function CartPage() {
  const recommended = getBestSellers(4);

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-6 sm:px-6">
      <CartView />
      <ProductSection title="You may also like" products={recommended} />
    </div>
  );
}

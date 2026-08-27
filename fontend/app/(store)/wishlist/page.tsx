"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { removeFromWishlist } from "@/store/slices/wishlistSlice";
import { addItem } from "@/store/slices/cartSlice";
import { showToast } from "@/store/slices/uiSlice";
import AccountSidebar from "@/components/store/AccountSidebar";

export default function WishlistPage() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((s) => s.wishlist);

  const handleAddToCart = (item: typeof items[0]) => {
    dispatch(
      addItem({
        productId: item.productId,
        name: item.name,
        image: "",
        imageColor: item.imageColor,
        price: item.price,
        quantity: 1,
        max: 10,
      }),
    );
    dispatch(showToast({ message: "បានបន្ថែមទៅកន្ត្រករួចរាល់" }));
  };

  const handleRemove = (productId: string) => {
    dispatch(removeFromWishlist(productId));
    dispatch(showToast({ message: "បានដកចេញពី Wishlist", type: "info" }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight mb-8">
        បញ្ជីចំណូលចិត្តរបស់ខ្ញុំ ({items.length})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <AccountSidebar />

        <div className="lg:col-span-9">
          {items.length === 0 ? (
            <div className="py-20 text-center space-y-4 border border-gray-200 rounded-sm">
              <Heart size={48} className="mx-auto text-gray-200" />
              <p className="text-lg font-semibold text-[#0a0a0a]">បញ្ជីចំណូលចិត្តរបស់អ្នកទទេ</p>
              <p className="text-sm text-gray-500">
                អ្នកមិនទាន់បានរក្សាទុកផលិតផលណាមួយនៅឡើយទេ
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0a0a0a] text-white text-sm font-bold rounded-sm hover:bg-gray-900 transition-colors"
              >
                <ArrowRight size={15} /> រកមើលផលិតផល
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              {items.map((item) => (
                <div key={item.productId} className="group border border-gray-200 rounded-sm overflow-hidden flex flex-col justify-between">
                  <div>
                    <div
                      className="aspect-[3/4] w-full flex items-end p-3 relative"
                      style={{ backgroundColor: item.imageColor || "#374151" }}
                    >
                      <button
                        type="button"
                        onClick={() => handleRemove(item.productId)}
                        className="absolute top-3 right-3 p-2 bg-white/90 rounded-sm hover:bg-white text-red-500 transition-colors"
                        aria-label="ដកចេញ"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="p-4 space-y-1">
                      <p className="text-[11px] text-gray-400 uppercase tracking-wider">{item.category}</p>
                      <Link href={`/products/${item.productId}`} className="text-sm font-bold text-[#0a0a0a] hover:underline block truncate">
                        {item.name}
                      </Link>
                      <p className="text-sm font-bold text-[#0a0a0a]">${item.price.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      className="w-full bg-[#0a0a0a] text-white text-xs font-bold py-2.5 rounded-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag size={14} /> បន្ថែមទៅកន្ត្រក
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import { Category, Product } from "@/types/product";

export const categories: Category[] = [
  { id: "c1", name: "Men", slug: "men", image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=300&h=300&fit=crop" },
  { id: "c2", name: "Women", slug: "women", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&h=300&fit=crop" },
  { id: "c3", name: "Electronics", slug: "electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=300&fit=crop" },
  { id: "c4", name: "Home & Living", slug: "home-living", image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=300&h=300&fit=crop" },
  { id: "c5", name: "Accessories", slug: "accessories", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop" },
];

export const products: Product[] = [
  {
    id: "p1",
    name: "Men's Running Shoes",
    slug: "mens-running-shoes",
    price: 49.99,
    compareAtPrice: 60.0,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=600&fit=crop",
    ],
    rating: 4.5,
    reviewCount: 120,
    category: "men",
    seller: { id: "s1", name: "Northline Athletics", rating: 4.8 },
    colors: ["#14213D", "#2F5FF6", "#3F9142"],
    sizes: ["7", "8", "9", "10", "11"],
    description:
      "Lightweight and comfortable running shoes for everyday training. Breathable mesh upper, responsive foam midsole, and a durable rubber outsole built for daily mileage.",
    inStock: true,
  },
  {
    id: "p2",
    name: "Wireless Headphones",
    slug: "wireless-headphones",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&h=600&fit=crop",
    ],
    rating: 4.6,
    reviewCount: 89,
    category: "electronics",
    seller: { id: "s2", name: "AudioHouse", rating: 4.6 },
    colors: ["#14213D", "#E3E7F0"],
    description: "Over-ear wireless headphones with active noise cancellation and 30-hour battery life.",
    inStock: true,
  },
  {
    id: "p3",
    name: "Smart Watch",
    slug: "smart-watch",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop"],
    rating: 4.3,
    reviewCount: 54,
    category: "electronics",
    seller: { id: "s2", name: "AudioHouse", rating: 4.6 },
    description: "Track workouts, heart rate, and notifications from your wrist.",
    inStock: true,
  },
  {
    id: "p4",
    name: "Everyday Backpack",
    slug: "everyday-backpack",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop"],
    rating: 4.4,
    reviewCount: 42,
    category: "accessories",
    seller: { id: "s3", name: "Fieldpack Co." , rating: 4.7 },
    description: "A durable, water-resistant backpack with a padded laptop sleeve.",
    inStock: true,
  },
  {
    id: "p5",
    name: "Casual T-Shirt",
    slug: "casual-t-shirt",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop"],
    rating: 4.2,
    reviewCount: 31,
    category: "men",
    seller: { id: "s1", name: "Northline Athletics", rating: 4.8 },
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
  },
  {
    id: "p6",
    name: "Slim Fit Shirt",
    slug: "slim-fit-shirt",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop"],
    rating: 4.1,
    reviewCount: 27,
    category: "men",
    seller: { id: "s4", name: "Merchant & Co.", rating: 4.5 },
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
  },
  {
    id: "p7",
    name: "Denim Jacket",
    slug: "denim-jacket",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop"],
    rating: 4.7,
    reviewCount: 63,
    category: "men",
    seller: { id: "s4", name: "Merchant & Co.", rating: 4.5 },
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
  },
  {
    id: "p8",
    name: "Men's Jeans",
    slug: "mens-jeans",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1602293589930-45821b8e2c6a?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1602293589930-45821b8e2c6a?w=600&h=600&fit=crop"],
    rating: 4.3,
    reviewCount: 48,
    category: "men",
    seller: { id: "s4", name: "Merchant & Co.", rating: 4.5 },
    sizes: ["30", "32", "34", "36"],
    inStock: true,
  },
  {
    id: "p9",
    name: "Sunglasses",
    slug: "sunglasses",
    price: 19.99,
    compareAtPrice: 24.99,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop"],
    rating: 4.4,
    reviewCount: 22,
    category: "accessories",
    seller: { id: "s3", name: "Fieldpack Co.", rating: 4.7 },
    inStock: true,
  },
  {
    id: "p10",
    name: "Classic Cap",
    slug: "classic-cap",
    price: 14.99,
    compareAtPrice: 18.0,
    image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&h=600&fit=crop"],
    rating: 4.0,
    reviewCount: 15,
    category: "accessories",
    seller: { id: "s3", name: "Fieldpack Co.", rating: 4.7 },
    inStock: true,
  },
  {
    id: "p11",
    name: "Leather Wallet",
    slug: "leather-wallet",
    price: 24.99,
    compareAtPrice: 30.0,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop"],
    rating: 4.6,
    reviewCount: 38,
    category: "accessories",
    seller: { id: "s3", name: "Fieldpack Co.", rating: 4.7 },
    inStock: true,
  },
  {
    id: "p12",
    name: "Pullover Hoodie",
    slug: "pullover-hoodie",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop",
    images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop"],
    rating: 4.5,
    reviewCount: 71,
    category: "men",
    seller: { id: "s1", name: "Northline Athletics", rating: 4.8 },
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(slug: string): Product[] {
  if (slug === "all") return products;
  return products.filter((p) => p.category === slug);
}

export function getRelatedProducts(product: Product, count = 4): Product[] {
  return products.filter((p) => p.id !== product.id).slice(0, count);
}

export function getBestSellers(count = 4): Product[] {
  return [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, count);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

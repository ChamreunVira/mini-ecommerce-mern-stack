export interface Seller {
  id: string;
  name: string;
  rating: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  images?: string[];
  rating: number;
  reviewCount: number;
  category: string;
  seller: Seller;
  colors?: string[];
  sizes?: string[];
  description?: string;
  inStock: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  productCount?: number;
  status?: "active" | "inactive";
  createdAt?: string;
}

export interface CartLine {
  product: Product;
  quantity: number;
}

// ── Order types ──────────────────────────────────────────────────────────────

export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
export type ShipmentStatus = "Unfulfilled" | "In Transit" | "Out for Delivery" | "Delivered" | "Returned";

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  variant?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: OrderStatus;
  shipmentStatus: ShipmentStatus;
  trackingNumber?: string;
  date: string;
  createdAt: string;
}

// ── Admin-specific types ──────────────────────────────────────────────────────

export interface ProductVariant {
  id: string;
  sku: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
}

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  discount: number;
  image: string;
  images: string[];
  category: string;
  categoryId: string;
  status: "active" | "inactive";
  inStock: boolean;
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  seller: Seller;
  colors?: string[];
  sizes?: string[];
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  status: "active" | "inactive";
  avatar?: string;
  phone?: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  usageLimit: number;
  usedCount: number;
  expiresAt: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface AppSettings {
  storeName: string;
  storeLogo: string;
  storeDescription: string;
  contactEmail: string;
  contactPhone: string;
  currency: string;
  shippingFee: number;
  taxRate: number;
}

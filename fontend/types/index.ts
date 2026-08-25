export interface CurrentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  role: string;
  avatar: string | null;
}

export interface UserItem {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  isAdmin: boolean;
  avatar: string | null;
}

export type ProductSize = "S" | "M" | "L" | "XL" | "2XL";

export interface ProductVariant {
  id: string;
  color: string;
  size: ProductSize;
  price: number;
  quantity: number;
  images: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  category: string;
  quantity: number;
  images: string[];
  variants: ProductVariant[];
  status: string;
  imageColor: string;
}

export interface Banner {
  id: string;
  title: string;
  description: string;
  order: number;
  status: string;
  imageColor: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: string;
  discount: number;
  totalUses: number;
  maxUses: number;
  expiryDate: string;
  status: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  status: string;
  imageColor: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  customerEmail: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  shippingAddress: string;
  items: OrderItem[];
}

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export const PAYMENT_STATUSES = ["paid", "unpaid", "failed"] as const;

export const PRODUCT_CATEGORIES = ["Men", "Women", "Unisex", "Accessories"] as const;

export const PRODUCT_STATUSES = ["In Stock", "Out of Stock", "Deleted"] as const;

export const USER_ROLES = ["ADMIN", "STAFF", "CUSTOMER"] as const;

/** Shared Active/Inactive lifecycle used by collections, coupons and banners. */
export const ENTITY_STATUSES = ["Active", "Inactive"] as const;

export const DISCOUNT_TYPES = ["percentage", "fixed"] as const;

export const DASHBOARD_RANGES = ["Last 7 days", "Last 30 days", "Last 90 days"] as const;

export type DashboardRange = (typeof DASHBOARD_RANGES)[number];

export interface DashboardStats {
  totalRevenue: number;
  totalRevenueChange: number;
  totalOrders: number;
  totalOrdersChange: number;
  averageOrderValue: number;
  activeCustomers: number;
  newCustomers: number;
}

export interface RevenueSeriesPoint {
  date: string;
  label: string;
  revenue: number;
}

export interface StatusDistributionItem {
  status: string;
  value: number;
  color: string;
}

export interface SettingsState {
  storeName: string;
  storeLogo: string;
  storeDescription: string;
  shippingFee: number;
  taxRate: number;
  currency: string;
  contactEmail: string;
  contactPhone: string;
}

// ─── Shared / Auth ──────────────────────────────────────────────────────────

export interface IAddress {
  _id?: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  province?: string;
  country: string;
  isDefault: boolean;
}

export interface CurrentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone?: string;
  gender?: "M" | "F" | "O";
  role: string;           // "ADMIN" | "STAFF" | "CUSTOMER"
  isAdmin: boolean;
  avatar: string | null;
  addresses: IAddress[];
}

// ─── User List (admin) ───────────────────────────────────────────────────────

export interface UserItem {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  isAdmin: boolean;
  avatar: string | null;
}

// ─── Product ─────────────────────────────────────────────────────────────────

export type ProductSize = "S" | "M" | "L" | "XL" | "2XL";

export interface ProductVariant {
  id: string;
  color: string;
  colorHex?: string;
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
  rating?: number;
  numReviews?: number;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  image: string;
  imageColor: string;
  price: number;
  quantity: number;
  variant?: {
    color: string;
    size: string;
  };
  max: number;
}

// ─── Wishlist ────────────────────────────────────────────────────────────────

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  discount: number;
  imageColor: string;
  category: string;
}

// ─── Review ─────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  user: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// ─── Order ───────────────────────────────────────────────────────────────────

export interface OrderItem {
  productId?: string;
  name: string;
  quantity: number;
  price: number;
  imageColor?: string;
}

export type OrderStatus = "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
export type PaymentStatus = "UNPAID" | "PENDING" | "PAID" | "FAILED";

export interface Order {
  id: string;
  orderNumber: string;
  user?: string;
  customerName?: string;
  customerEmail?: string;
  status: OrderStatus;
  shippingAddress: IAddress;
  orderItems: OrderItem[];
  couponCode?: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: "KHQR" | "COD";
  createdAt: string;
}

// ─── Toast ───────────────────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

// ─── Admin types (unchanged) ─────────────────────────────────────────────────

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

export const ORDER_STATUSES = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"] as const;
export const PAYMENT_STATUSES = ["UNPAID", "PENDING", "PAID", "FAILED"] as const;
export const PRODUCT_CATEGORIES = ["Men", "Women", "Unisex", "Accessories"] as const;
export const PRODUCT_STATUSES = ["In Stock", "Out of Stock", "Deleted"] as const;
export const USER_ROLES = ["ADMIN", "STAFF", "CUSTOMER"] as const;
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

"use client";

import { useSyncExternalStore } from "react";
import {
  AdminProduct,
  AppSettings,
  Banner,
  Category,
  Coupon,
  Order,
  OrderStatus,
  ShipmentStatus,
  User,
} from "@/types/product";
import {
  initialBanners,
  initialCategories,
  initialCoupons,
  initialOrders,
  initialProducts,
  initialUsers,
} from "@/lib/data";

export interface ToastMessage {
  id: string;
  type: "success" | "info" | "warning" | "error";
  text: string;
}

interface CartItem {
  product: AdminProduct;
  quantity: number;
}

const defaultSettings: AppSettings = {
  storeName: "Marlo Marketplace",
  storeLogo: "",
  storeDescription: "A modern e-commerce store for fashion and electronics.",
  contactEmail: "support@marlo.com",
  contactPhone: "+855 23 000 001",
  currency: "USD",
  shippingFee: 5.0,
  taxRate: 5,
};

class AppStore {
  private products: AdminProduct[] = initialProducts;
  private categories: Category[] = initialCategories;
  private orders: Order[] = initialOrders;
  private users: User[] = initialUsers;
  private coupons: Coupon[] = initialCoupons;
  private banners: Banner[] = initialBanners;
  private settings: AppSettings = defaultSettings;
  private cart: CartItem[] = [
    { product: initialProducts[0], quantity: 1 },
    { product: initialProducts[1], quantity: 2 },
  ];
  private wishlist: string[] = ["p1"];
  private toasts: ToastMessage[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== "undefined") {
      const load = <T>(key: string, fallback: T): T => {
        try {
          const raw = localStorage.getItem(key);
          return raw ? (JSON.parse(raw) as T) : fallback;
        } catch {
          return fallback;
        }
      };
      this.products = load("marlo_products", initialProducts);
      this.categories = load("marlo_categories", initialCategories);
      this.orders = load("marlo_orders", initialOrders);
      this.users = load("marlo_users", initialUsers);
      this.coupons = load("marlo_coupons", initialCoupons);
      this.banners = load("marlo_banners", initialBanners);
      this.settings = load("marlo_settings", defaultSettings);
    }
  }

  private persist() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("marlo_products", JSON.stringify(this.products));
        localStorage.setItem("marlo_categories", JSON.stringify(this.categories));
        localStorage.setItem("marlo_orders", JSON.stringify(this.orders));
        localStorage.setItem("marlo_users", JSON.stringify(this.users));
        localStorage.setItem("marlo_coupons", JSON.stringify(this.coupons));
        localStorage.setItem("marlo_banners", JSON.stringify(this.banners));
        localStorage.setItem("marlo_settings", JSON.stringify(this.settings));
      } catch {}
    }
    this.listeners.forEach((l) => l());
  }

  private notify() {
    this.persist();
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };

  getProducts = (): AdminProduct[] => this.products;
  getCategories = (): Category[] => this.categories;
  getOrders = (): Order[] => this.orders;
  getUsers = (): User[] => this.users;
  getCoupons = (): Coupon[] => this.coupons;
  getBanners = (): Banner[] => this.banners;
  getSettings = (): AppSettings => this.settings;
  getCart = (): CartItem[] => this.cart;
  getWishlist = (): string[] => this.wishlist;
  getToasts = (): ToastMessage[] => this.toasts;

  // ── Toasts ──────────────────────────────────────────────────────────────────

  addToast(text: string, type: ToastMessage["type"] = "success") {
    const id = "t_" + Math.random().toString(36).substring(2, 9);
    this.toasts = [...this.toasts, { id, text, type }];
    this.notify();
    setTimeout(() => this.removeToast(id), 3500);
  }

  removeToast(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  copyToClipboard(id: string, entityName = "ID") {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(id);
      this.addToast(`Copied ${entityName} (${id}) to clipboard!`, "info");
    } else {
      this.addToast(`ID: ${id}`, "info");
    }
  }

  // ── Products ────────────────────────────────────────────────────────────────

  addProduct(data: Omit<AdminProduct, "id" | "rating" | "reviewCount">) {
    const newProduct: AdminProduct = {
      ...data,
      id: "p_" + Math.random().toString(36).substring(2, 8),
      rating: 5.0,
      reviewCount: 0,
    };
    this.products = [newProduct, ...this.products];
    this.addToast(`Product "${newProduct.name}" created.`);
    this.notify();
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<AdminProduct>) {
    this.products = this.products.map((p) => (p.id === id ? { ...p, ...updates } : p));
    this.addToast("Product updated.");
    this.notify();
  }

  toggleProductStatus(id: string) {
    this.products = this.products.map((p) => {
      if (p.id === id) {
        const next = p.status === "active" ? "inactive" : "active";
        this.addToast(`"${p.name}" is now ${next}.`);
        return { ...p, status: next, inStock: next === "active" ? p.inStock : false };
      }
      return p;
    });
    this.notify();
  }

  toggleProductStock(id: string) {
    this.products = this.products.map((p) => {
      if (p.id === id) {
        const next = !p.inStock;
        this.addToast(`"${p.name}" is now ${next ? "In Stock" : "Out of Stock"}.`);
        return { ...p, inStock: next };
      }
      return p;
    });
    this.notify();
  }

  deleteProduct(id: string) {
    const t = this.products.find((p) => p.id === id);
    this.products = this.products.filter((p) => p.id !== id);
    this.addToast(`Deleted "${t?.name ?? id}".`, "warning");
    this.notify();
  }

  // ── Orders ──────────────────────────────────────────────────────────────────

  updateOrderStatus(orderId: string, status: OrderStatus) {
    this.orders = this.orders.map((o) =>
      o.id === orderId ? { ...o, orderStatus: status } : o
    );
    this.addToast(`Order ${orderId} → ${status}`);
    this.notify();
  }

  updateShipmentStatus(orderId: string, status: ShipmentStatus, trackingNumber?: string) {
    this.orders = this.orders.map((o) => {
      if (o.id !== orderId) return o;
      return {
        ...o,
        shipmentStatus: status,
        trackingNumber: trackingNumber ?? o.trackingNumber ?? `KH-TRK-${Math.floor(10000 + Math.random() * 90000)}`,
      };
    });
    this.addToast(`Shipment ${orderId} → ${status}`);
    this.notify();
  }

  deleteOrder(orderId: string) {
    this.orders = this.orders.filter((o) => o.id !== orderId);
    this.addToast(`Deleted Order ${orderId}.`, "warning");
    this.notify();
  }

  // ── Categories ──────────────────────────────────────────────────────────────

  addCategory(data: Omit<Category, "id">) {
    const newCat: Category = {
      ...data,
      id: "cat_" + Math.random().toString(36).substring(2, 7),
    };
    this.categories = [...this.categories, newCat];
    this.addToast(`Category "${newCat.name}" created.`);
    this.notify();
    return newCat;
  }

  updateCategory(id: string, updates: Partial<Category>) {
    this.categories = this.categories.map((c) => (c.id === id ? { ...c, ...updates } : c));
    this.addToast("Category updated.");
    this.notify();
  }

  toggleCategoryStatus(id: string) {
    this.categories = this.categories.map((c) => {
      if (c.id === id) {
        const next = c.status === "active" ? "inactive" : "active";
        this.addToast(`"${c.name}" is now ${next}.`);
        return { ...c, status: next };
      }
      return c;
    });
    this.notify();
  }

  softDeleteCategory(id: string) {
    this.categories = this.categories.map((c) =>
      c.id === id ? { ...c, status: "inactive" } : c
    );
    this.addToast("Category deactivated (soft delete).", "warning");
    this.notify();
  }

  // ── Users ────────────────────────────────────────────────────────────────────

  updateUser(id: string, updates: Partial<User>) {
    this.users = this.users.map((u) => (u.id === id ? { ...u, ...updates } : u));
    this.addToast("User updated.");
    this.notify();
  }

  toggleUserStatus(id: string) {
    this.users = this.users.map((u) => {
      if (u.id === id) {
        const next = u.status === "active" ? "inactive" : "active";
        this.addToast(`User "${u.name}" is now ${next}.`);
        return { ...u, status: next };
      }
      return u;
    });
    this.notify();
  }

  // ── Coupons ──────────────────────────────────────────────────────────────────

  addCoupon(data: Omit<Coupon, "id" | "usedCount" | "createdAt">) {
    const newCoupon: Coupon = {
      ...data,
      id: "coup_" + Math.random().toString(36).substring(2, 7),
      usedCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    this.coupons = [newCoupon, ...this.coupons];
    this.addToast(`Coupon "${newCoupon.code}" created.`);
    this.notify();
    return newCoupon;
  }

  updateCoupon(id: string, updates: Partial<Coupon>) {
    this.coupons = this.coupons.map((c) => (c.id === id ? { ...c, ...updates } : c));
    this.addToast("Coupon updated.");
    this.notify();
  }

  toggleCouponStatus(id: string) {
    this.coupons = this.coupons.map((c) => {
      if (c.id === id) {
        const next = c.status === "active" ? "inactive" : "active";
        this.addToast(`Coupon "${c.code}" is now ${next}.`);
        return { ...c, status: next };
      }
      return c;
    });
    this.notify();
  }

  deleteCoupon(id: string) {
    const t = this.coupons.find((c) => c.id === id);
    this.coupons = this.coupons.filter((c) => c.id !== id);
    this.addToast(`Deleted coupon "${t?.code ?? id}".`, "warning");
    this.notify();
  }

  // ── Banners ──────────────────────────────────────────────────────────────────

  addBanner(data: Omit<Banner, "id" | "createdAt">) {
    const newBanner: Banner = {
      ...data,
      id: "ban_" + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString().split("T")[0],
    };
    this.banners = [newBanner, ...this.banners];
    this.addToast(`Banner "${newBanner.title}" created.`);
    this.notify();
    return newBanner;
  }

  updateBanner(id: string, updates: Partial<Banner>) {
    this.banners = this.banners.map((b) => (b.id === id ? { ...b, ...updates } : b));
    this.addToast("Banner updated.");
    this.notify();
  }

  toggleBannerStatus(id: string) {
    this.banners = this.banners.map((b) => {
      if (b.id === id) {
        const next = b.status === "active" ? "inactive" : "active";
        this.addToast(`Banner "${b.title}" is now ${next}.`);
        return { ...b, status: next };
      }
      return b;
    });
    this.notify();
  }

  deleteBanner(id: string) {
    const t = this.banners.find((b) => b.id === id);
    this.banners = this.banners.filter((b) => b.id !== id);
    this.addToast(`Deleted banner "${t?.title ?? id}".`, "warning");
    this.notify();
  }

  // ── Settings ─────────────────────────────────────────────────────────────────

  saveSettings(updates: Partial<AppSettings>) {
    this.settings = { ...this.settings, ...updates };
    this.addToast("Settings saved successfully.");
    this.notify();
  }

  // ── Cart & Wishlist ──────────────────────────────────────────────────────────

  addToCart(product: AdminProduct) {
    const existing = this.cart.find((item) => item.product.id === product.id);
    if (existing) {
      this.cart = this.cart.map((item) =>
        item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      this.cart = [...this.cart, { product, quantity: 1 }];
    }
    this.addToast(`Added "${product.name}" to cart!`);
    this.notify();
  }

  toggleWishlist(productId: string) {
    if (this.wishlist.includes(productId)) {
      this.wishlist = this.wishlist.filter((id) => id !== productId);
      this.addToast("Removed from wishlist.", "info");
    } else {
      this.wishlist = [...this.wishlist, productId];
      this.addToast("Saved to wishlist!");
    }
    this.notify();
  }
}

export const store = new AppStore();

export function useProducts() {
  return useSyncExternalStore(store.subscribe, store.getProducts, store.getProducts);
}
export function useCategories() {
  return useSyncExternalStore(store.subscribe, store.getCategories, store.getCategories);
}
export function useOrders() {
  return useSyncExternalStore(store.subscribe, store.getOrders, store.getOrders);
}
export function useUsers() {
  return useSyncExternalStore(store.subscribe, store.getUsers, store.getUsers);
}
export function useCoupons() {
  return useSyncExternalStore(store.subscribe, store.getCoupons, store.getCoupons);
}
export function useBanners() {
  return useSyncExternalStore(store.subscribe, store.getBanners, store.getBanners);
}
export function useAppSettings() {
  return useSyncExternalStore(store.subscribe, store.getSettings, store.getSettings);
}
export function useCart() {
  return useSyncExternalStore(store.subscribe, store.getCart, store.getCart);
}
export function useWishlist() {
  return useSyncExternalStore(store.subscribe, store.getWishlist, store.getWishlist);
}
export function useToasts() {
  return useSyncExternalStore(store.subscribe, store.getToasts, store.getToasts);
}

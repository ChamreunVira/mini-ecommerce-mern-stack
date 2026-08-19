"use client";

import { useSyncExternalStore } from "react";
import { Category, Order, OrderStatus, Product, ShipmentStatus } from "@/types/product";
import { initialCategories, initialOrders, initialProducts } from "@/lib/data";

export interface ToastMessage {
  id: string;
  type: "success" | "info" | "warning" | "error";
  text: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

class AppStore {
  private products: Product[] = initialProducts;
  private categories: Category[] = initialCategories;
  private orders: Order[] = initialOrders;
  private cart: CartItem[] = [
    { product: initialProducts[0], quantity: 1 },
    { product: initialProducts[1], quantity: 2 },
  ];
  private wishlist: string[] = ["prod-1"];
  private toasts: ToastMessage[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== "undefined") {
      const savedProducts = localStorage.getItem("marlo_products");
      if (savedProducts) {
        try { this.products = JSON.parse(savedProducts); } catch (_) {}
      }

      const savedCategories = localStorage.getItem("marlo_categories");
      if (savedCategories) {
        try { this.categories = JSON.parse(savedCategories); } catch (_) {}
      }

      const savedOrders = localStorage.getItem("marlo_orders");
      if (savedOrders) {
        try { this.orders = JSON.parse(savedOrders); } catch (_) {}
      }
    }
  }

  private notify() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("marlo_products", JSON.stringify(this.products));
        localStorage.setItem("marlo_categories", JSON.stringify(this.categories));
        localStorage.setItem("marlo_orders", JSON.stringify(this.orders));
      } catch (_) {}
    }
    this.listeners.forEach((l) => l());
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  // State Snapshot getters
  getProducts = (): Product[] => this.products;
  getCategories = (): Category[] => this.categories;
  getOrders = (): Order[] => this.orders;
  getCart = (): CartItem[] => this.cart;
  getWishlist = (): string[] => this.wishlist;
  getToasts = (): ToastMessage[] => this.toasts;

  // Toasts
  addToast(text: string, type: ToastMessage["type"] = "success") {
    const id = "t_" + Math.random().toString(36).substring(2, 9);
    this.toasts = [...this.toasts, { id, text, type }];
    this.notify();
    setTimeout(() => {
      this.removeToast(id);
    }, 3000);
  }

  removeToast(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  // Copy ID utility with toast
  copyToClipboard(id: string, entityName: string = "ID") {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(id);
      this.addToast(`Copied ${entityName} (${id}) to clipboard!`, "info");
    } else {
      this.addToast(`ID: ${id}`, "info");
    }
  }

  // Product Actions
  addProduct(productData: Omit<Product, "id" | "rating" | "reviewCount">) {
    const newProduct: Product = {
      ...productData,
      id: "prod-" + Math.random().toString(36).substring(2, 8),
      rating: 5.0,
      reviewCount: 1,
    };
    this.products = [newProduct, ...this.products];
    this.addToast(`Product "${newProduct.name}" added successfully!`);
    this.notify();
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>) {
    this.products = this.products.map((p) => (p.id === id ? { ...p, ...updates } : p));
    this.addToast(`Product updated successfully.`);
    this.notify();
  }

  toggleProductStock(id: string) {
    this.products = this.products.map((p) => {
      if (p.id === id) {
        const nextInStock = !p.inStock;
        this.addToast(`"${p.name}" is now ${nextInStock ? "In Stock" : "Out of Stock"}`);
        return { ...p, inStock: nextInStock };
      }
      return p;
    });
    this.notify();
  }

  deleteProduct(id: string) {
    const target = this.products.find((p) => p.id === id);
    this.products = this.products.filter((p) => p.id !== id);
    this.addToast(`Deleted product ${target ? `"${target.name}"` : id}`, "warning");
    this.notify();
  }

  // Order Actions
  updateOrderStatus(orderId: string, status: OrderStatus) {
    this.orders = this.orders.map((o) => {
      if (o.id === orderId) {
        this.addToast(`Order ${orderId} status set to "${status}"`);
        return { ...o, orderStatus: status };
      }
      return o;
    });
    this.notify();
  }

  updateShipmentStatus(orderId: string, status: ShipmentStatus, trackingNumber?: string) {
    this.orders = this.orders.map((o) => {
      if (o.id === orderId) {
        this.addToast(`Order ${orderId} shipment updated to "${status}"`);
        return {
          ...o,
          shipmentStatus: status,
          trackingNumber: trackingNumber || o.trackingNumber || `KH-TRK-${Math.floor(10000 + Math.random() * 90000)}`,
        };
      }
      return o;
    });
    this.notify();
  }

  deleteOrder(orderId: string) {
    this.orders = this.orders.filter((o) => o.id !== orderId);
    this.addToast(`Deleted Order ${orderId}`, "warning");
    this.notify();
  }

  // Category Actions
  addCategory(name: string, slug: string, image: string) {
    const newCat: Category = {
      id: "cat-" + Math.random().toString(36).substring(2, 7),
      name,
      slug,
      image: image || "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=300&h=300&fit=crop",
      productCount: 0,
    };
    this.categories = [...this.categories, newCat];
    this.addToast(`Added category "${name}"`);
    this.notify();
  }

  updateCategory(id: string, name: string, slug: string, image: string) {
    this.categories = this.categories.map((c) => (c.id === id ? { ...c, name, slug, image } : c));
    this.addToast(`Updated category "${name}"`);
    this.notify();
  }

  deleteCategory(id: string) {
    const cat = this.categories.find((c) => c.id === id);
    this.categories = this.categories.filter((c) => c.id !== id);
    this.addToast(`Deleted category "${cat?.name || id}"`, "warning");
    this.notify();
  }

  // Cart & Wishlist
  addToCart(product: Product) {
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
      this.addToast("Removed from wishlist", "info");
    } else {
      this.wishlist = [...this.wishlist, productId];
      this.addToast("Saved to wishlist!", "success");
    }
    this.notify();
  }
}

export const store = new AppStore();

// React Hooks for Fast Hydration & Zero Lag Updates
export function useProducts() {
  return useSyncExternalStore(store.subscribe, store.getProducts, store.getProducts);
}

export function useCategories() {
  return useSyncExternalStore(store.subscribe, store.getCategories, store.getCategories);
}

export function useOrders() {
  return useSyncExternalStore(store.subscribe, store.getOrders, store.getOrders);
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

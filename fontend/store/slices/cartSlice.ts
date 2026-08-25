import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  totalItems: number;
  isOpen: boolean;
}

const SHIPPING_FEE = 3.0;

function calculateTotals(state: CartState) {
  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = state.items.length > 0 ? (subtotal >= 50 ? 0 : SHIPPING_FEE) : 0;
  state.subtotal = subtotal;
  state.shippingFee = shippingFee;
  state.discount = 0;
  state.total = subtotal + shippingFee - state.discount;
  state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
}

const initialState: CartState = {
  items: [],
  subtotal: 0,
  shippingFee: 0,
  discount: 0,
  total: 0,
  totalItems: 0,
  isOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const incoming = action.payload;
      const key = incoming.variantId
        ? `${incoming.productId}-${incoming.variantId}`
        : incoming.productId;
      const existing = state.items.find((i) => {
        const k = i.variantId ? `${i.productId}-${i.variantId}` : i.productId;
        return k === key;
      });
      if (existing) {
        existing.quantity = Math.min(existing.quantity + incoming.quantity, existing.max);
      } else {
        state.items.push(incoming);
      }
      calculateTotals(state);
    },

    removeItem(state, action: PayloadAction<{ productId: string; variantId?: string }>) {
      const { productId, variantId } = action.payload;
      state.items = state.items.filter((i) => {
        if (variantId) return !(i.productId === productId && i.variantId === variantId);
        return i.productId !== productId;
      });
      calculateTotals(state);
    },

    updateQuantity(
      state,
      action: PayloadAction<{ productId: string; variantId?: string; quantity: number }>,
    ) {
      const { productId, variantId, quantity } = action.payload;
      const item = state.items.find((i) =>
        variantId
          ? i.productId === productId && i.variantId === variantId
          : i.productId === productId,
      );
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i !== item);
        } else {
          item.quantity = Math.min(quantity, item.max);
        }
      }
      calculateTotals(state);
    },

    clearCart(state) {
      state.items = [];
      calculateTotals(state);
    },

    setDrawerOpen(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload;
    },

    applyDiscount(state, action: PayloadAction<number>) {
      state.discount = action.payload;
      calculateTotals(state);
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart, setDrawerOpen, applyDiscount } =
  cartSlice.actions;
export default cartSlice.reducer;

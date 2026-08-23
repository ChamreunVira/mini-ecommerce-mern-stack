import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order } from "@/types";

interface OrdersState {
  items: Order[];
}

const initialState: OrdersState = {
  items: [
    {
      id: "o1",
      orderNumber: "ORD-20251105-000231",
      customer: "Thann Sopheakboth",
      customerEmail: "boththann76@gmail.com",
      total: 65.0,
      status: "confirmed",
      paymentStatus: "paid",
      createdAt: "2025-11-05",
      shippingAddress: "St. 271, Sen Sok, Phnom Penh, Cambodia",
      items: [
        { name: "Kdüssy Tees", quantity: 1, price: 30.0 },
        { name: "Kdmv X Tena Cap", quantity: 1, price: 22.0 },
        { name: "PCMKR NAGA TEES", quantity: 1, price: 13.0 },
      ],
    },
    {
      id: "o2",
      orderNumber: "ORD-20251108-000232",
      customer: "Tena Khimphun",
      customerEmail: "thannsopheakboth@gmail.com",
      total: 42.0,
      status: "pending",
      paymentStatus: "unpaid",
      createdAt: "2025-11-08",
      shippingAddress: "St. 105, Toul Kork, Phnom Penh, Cambodia",
      items: [{ name: "Kdüssy Hoodie", quantity: 1, price: 42.0 }],
    },
    {
      id: "o3",
      orderNumber: "ORD-20251111-000233",
      customer: "Chan Dara",
      customerEmail: "chan.dara@example.com",
      total: 28.0,
      status: "confirmed",
      paymentStatus: "paid",
      createdAt: "2025-11-11",
      shippingAddress: "St. 360, Chamkarmon, Phnom Penh, Cambodia",
      items: [{ name: "Kdüssy Tees", quantity: 1, price: 28.0 }],
    },
    {
      id: "o4",
      orderNumber: "ORD-20251115-000234",
      customer: "Sok Pisey",
      customerEmail: "sok.pisey@example.com",
      total: 5.0,
      status: "cancelled",
      paymentStatus: "failed",
      createdAt: "2025-11-15",
      shippingAddress: "St. 598, Chroy Changvar, Phnom Penh, Cambodia",
      items: [{ name: "Kdmv Sticker Pack", quantity: 1, price: 5.0 }],
    },
    {
      id: "o5",
      orderNumber: "ORD-20251119-000235",
      customer: "Vanna Reaksmey",
      customerEmail: "vanna.reaksmey@example.com",
      total: 38.0,
      status: "delivered",
      paymentStatus: "paid",
      createdAt: "2025-11-19",
      shippingAddress: "St. 2004, Sen Sok, Phnom Penh, Cambodia",
      items: [{ name: "Equipe Jersey", quantity: 1, price: 38.0 }],
    },
  ],
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    updateOrderStatus(state, action: PayloadAction<{ id: string; status: string }>) {
      const { id, status } = action.payload;
      const order = state.items.find((o) => o.id === id);
      if (order) order.status = status;
    },
    updateOrderPaymentStatus(
      state,
      action: PayloadAction<{ id: string; paymentStatus: string }>,
    ) {
      const { id, paymentStatus } = action.payload;
      const order = state.items.find((o) => o.id === id);
      if (order) order.paymentStatus = paymentStatus;
    },
  },
});

export const { updateOrderStatus, updateOrderPaymentStatus } = ordersSlice.actions;
export default ordersSlice.reducer;

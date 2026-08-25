import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order, OrderStatus, PaymentStatus } from "@/types";

interface OrdersState {
  items: Order[];
}

const initialState: OrdersState = {
  items: [
    {
      id: "o1",
      orderNumber: "ORD-20251105-000231",
      subtotal: 65.0,
      shippingFee: 0,
      discount: 0,
      total: 65.0,
      status: "CONFIRMED",
      paymentStatus: "PAID",
      createdAt: "2025-11-05",
      shippingAddress: {
        fullName: "Thann Sopheakboth",
        phone: "013222123",
        address: "St. 271, Sen Sok",
        city: "Phnom Penh",
        country: "Cambodia",
        isDefault: true,
      },
      orderItems: [
        { name: "Kdüssy Tees", quantity: 1, price: 30.0 },
        { name: "Kdmv X Tena Cap", quantity: 1, price: 22.0 },
        { name: "PCMKR NAGA TEES", quantity: 1, price: 13.0 },
      ],
    },
    {
      id: "o2",
      orderNumber: "ORD-20251108-000232",
      subtotal: 42.0,
      shippingFee: 0,
      discount: 0,
      total: 42.0,
      status: "PENDING",
      paymentStatus: "UNPAID",
      createdAt: "2025-11-08",
      shippingAddress: {
        fullName: "Tena Khimphun",
        phone: "012345678",
        address: "St. 105, Toul Kork",
        city: "Phnom Penh",
        country: "Cambodia",
        isDefault: false,
      },
      orderItems: [{ name: "Kdüssy Hoodie", quantity: 1, price: 42.0 }],
    },
    {
      id: "o3",
      orderNumber: "ORD-20251111-000233",
      subtotal: 28.0,
      shippingFee: 0,
      discount: 0,
      total: 28.0,
      status: "CONFIRMED",
      paymentStatus: "PAID",
      createdAt: "2025-11-11",
      shippingAddress: {
        fullName: "Chan Dara",
        phone: "099887766",
        address: "St. 360, Chamkarmon",
        city: "Phnom Penh",
        country: "Cambodia",
        isDefault: false,
      },
      orderItems: [{ name: "Kdüssy Tees", quantity: 1, price: 28.0 }],
    },
    {
      id: "o4",
      orderNumber: "ORD-20251115-000234",
      subtotal: 5.0,
      shippingFee: 0,
      discount: 0,
      total: 5.0,
      status: "CANCELLED",
      paymentStatus: "FAILED",
      createdAt: "2025-11-15",
      shippingAddress: {
        fullName: "Sok Pisey",
        phone: "011223344",
        address: "St. 598, Chroy Changvar",
        city: "Phnom Penh",
        country: "Cambodia",
        isDefault: false,
      },
      orderItems: [{ name: "Kdmv Sticker Pack", quantity: 1, price: 5.0 }],
    },
    {
      id: "o5",
      orderNumber: "ORD-20251119-000235",
      subtotal: 38.0,
      shippingFee: 0,
      discount: 0,
      total: 38.0,
      status: "DELIVERED",
      paymentStatus: "PAID",
      createdAt: "2025-11-19",
      shippingAddress: {
        fullName: "Vanna Reaksmey",
        phone: "077112233",
        address: "St. 2004, Sen Sok",
        city: "Phnom Penh",
        country: "Cambodia",
        isDefault: false,
      },
      orderItems: [{ name: "Equipe Jersey", quantity: 1, price: 38.0 }],
    },
  ],
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    updateOrderStatus(state, action: PayloadAction<{ id: string; status: OrderStatus }>) {
      const { id, status } = action.payload;
      const order = state.items.find((o) => o.id === id);
      if (order) order.status = status;
    },
    updateOrderPaymentStatus(
      state,
      action: PayloadAction<{ id: string; paymentStatus: PaymentStatus }>,
    ) {
      const { id, paymentStatus } = action.payload;
      const order = state.items.find((o) => o.id === id);
      if (order) order.paymentStatus = paymentStatus;
    },
  },
});

export const { updateOrderStatus, updateOrderPaymentStatus } = ordersSlice.actions;
export default ordersSlice.reducer;

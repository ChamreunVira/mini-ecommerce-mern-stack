import { model, Schema, Document, Types } from "mongoose";
import { IAddress } from "./user.model.js";

export interface IShipmentAddress extends Omit<IAddress, "isDefault"> {}

export interface IOrderItem {
  product: Types.ObjectId;
  variantSku?: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  user: Types.ObjectId;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  shippingAddress: IShipmentAddress;
  orderItems: IOrderItem[];
  couponCode?: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
}

const shipmentSchema = new Schema<IShipmentAddress>(
  {
    fullName: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      default: "Phnom Penh",
    },
    province: {
      type: String,
    },
    country: {
      type: String,
      default: "Cambodia",
      required: true,
    },
  },
  { _id: true },
);

export const orderItemSchema = new Schema<IOrderItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variantSku: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: 0.0,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      default: 0.0,
      required: true,
    },
  },
  { _id: true },
);

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [orderItemSchema],
    shippingAddress: shipmentSchema,
    couponCode: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PENDING",
      required: true,
    },
    shippingFee: {
      type: Number,
      default: 0.0,
      required: true,
    },
    discount: {
      type: Number,
      default: 0.0,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

orderSchema.pre("save", async function () {
  if (!this.isNew || this.orderNumber) {
    return;
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const dateString = `${year}${month}${day}`;

  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomCode = "";
  for (let i = 0; i < 6; i++) {
    randomCode += characters.charAt(
      Math.floor(Math.random() * characters.length),
    );
  }
  this.orderNumber = `ORD-${dateString}-${randomCode}`;
});

export default model<IOrder>("Order", orderSchema);

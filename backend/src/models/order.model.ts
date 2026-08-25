import { Schema } from "mongoose";
import { IAddress } from "./user.model.js";

interface IShipmentAddress extends Omit<IAddress, "isDefault"> {}

interface IPayment {
  qrString: string;
  md5: string;
  transactionId: string;
  status: "UNPAID" | "PENDING" | "PAID" | "FAILED";
  amount: Number;
  currenty: "KHR" | "USD";
  qrExpiresAt: Date;
  paidAt: Date;
}

interface IOrder {
  orderNumber: string;
  user: Schema.Types.ObjectId;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  shipppingAddress: IShipmentAddress;
  payment: IPayment;
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  total: number;
}

const shipmentSchema = new Schema<IShipmentAddress>(
  {
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

const paymentSchema = new Schema<IPayment>({
  qrString: {
    type: String,
    required: true,
  },
  md5: {
    type: String,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["UNPAID", "PEDING", "PAID", "FAILED"],
    default: "PENDING",
    required: true,
  },
  amount: {
    type: Number,
    default: 0.0,
    required: true,
  },
  currenty: {
    type: String,
    default: "USD",
    enum: ["USD", "KHR"],
    required: true,
  },
  qrExpiresAt: {
    type: Date,
    required: true,
  },
  paidAt: {
    type: Date,
  },
});

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    shipppingAddress: [shipmentSchema],

    payment: [paymentSchema],

    subtotal: {
      type: Number,
      default: 0.0,
      required: true,
    },

    shippingFee: {
      type: Number,
      default: 0.0,
    },

    tax: {
      type: Number,
      default: 0.0,
    },

    discount: {
      type: Number,
      default: 0.0,
    },
  },
  { timestamps: true },
);

import { NextFunction } from "express";
import mongoose, { Document, model, Schema } from "mongoose";

export interface ICartItem extends Document {
  product: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  totalItems: number;
  totalPrice: number;
  calculateTotals: () => void;
}

const cartItemSchema = new Schema<ICartItem>(
  {
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
  },
  { _id: true },
);

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    items: [cartItemSchema],
    totalItems: {
      type: Number,
      default: 0,
      required: true,
    },
    totalPrice: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { timestamps: true },
);

cartSchema.methods.calculateTotals = function (this: ICart) {
  console.log("This function is working normaly.");
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.totalPrice = this.items.reduce((sum, item) => sum + item.subtotal, 0);
};

cartSchema.pre("save", function (next) {
  this.calculateTotals();
  console.log("This function it's work normal");
});

export default model<ICart>("Cart", cartSchema);
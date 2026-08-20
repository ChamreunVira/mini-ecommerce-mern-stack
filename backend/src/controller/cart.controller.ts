import { Request, Response } from "express";
import Cart from "../models/cart.model.js";
import Product from "../models/product.models.js";
import { AppError } from "../types/AppError.js";
import { Types } from "mongoose";

export const cartController = {
  readCart: async (req: Request, res: Response) => {
    const cart = await getOrCreateCart(req.user!._id);
    res.status(200).json({ data: cart });
  },
  addItem: async (req: Request, res: Response) => {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);

    if (!product) throw new AppError(404, "Product not found.");

    const cart = await getOrCreateCart(req.user!._id);

    const existingItem = cart.items.find((item) =>
      item.product.equals(productId),
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.subtotal = existingItem.price * existingItem.quantity;
    } else {
      cart.items.push({
        product: new Types.ObjectId(productId),
        name: product.name,
        price: product.price,
        quantity,
        subtotal: product.price * quantity,
      } as any);
    }

    res.status(200).json({
      data: cart,
    });
  },
};

const getOrCreateCart = async (userId: Types.ObjectId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

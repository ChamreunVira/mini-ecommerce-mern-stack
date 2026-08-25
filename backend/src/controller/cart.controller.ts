import { Request, Response } from "express";
import Cart from "../models/cart.model.js";
import Product from "../models/product.models.js";
import { AppError } from "../types/AppError.js";
import { Types } from "mongoose";
import { calculateItemPricing } from "../utils/pricing.util.js";

export const cartController = {
  readCart: async (req: Request, res: Response) => {
    const cart = await getOrCreateCart(req.user!._id);
    res.status(200).json({ data: cart });
  },

  addItem: async (req: Request, res: Response) => {
    const { productId, quantity, variantSku } = req.body;
    const product = await Product.findById(productId);

    if (!product) throw new AppError(404, "Product not found.");

    if (product.quantity < quantity) throw new AppError(400, "Insufficient stock.");

    const cart = await getOrCreateCart(req.user!._id);

    const existingItem = cart.items.find((item) =>
      item.product.equals(productId) && (variantSku ? item.variantSku === variantSku : true),
    );

    const itemPricing = calculateItemPricing(
      product.price,
      quantity,
      product.discount,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      const totalPricing = calculateItemPricing(
        product.price,
        existingItem.quantity,
        product.discount,
      );
      existingItem.subtotal = totalPricing.subtotal;
    } else {
      cart.items.push({
        product: new Types.ObjectId(productId),
        name: product.name,
        variantSku: variantSku || "",
        price: itemPricing.price,
        quantity,
        subtotal: itemPricing.subtotal,
      } as any);
    }

    const savedCart = await cart.save();

    res.status(200).json({
      data: savedCart,
    });
  },

  updateItem: async (req: Request, res: Response) => {
    const { cartId } = req.params;
    const { productId, quantity } = req.body;

    const cart = await Cart.findById(cartId);
    if (!cart) throw new AppError(404, "Cart not found!");

    const product = await Product.findById(productId);
    if (!product) throw new AppError(404, "Product not found.");

    if (product.quantity < quantity) throw new AppError(400, "Insufficient stock.");

    const itemIndex = cart.items.findIndex((item) =>
      item.product.equals(product._id),
    );

    if (itemIndex > -1) {
      const item = cart.items[itemIndex];
      item.quantity = quantity;
      const updatedPricing = calculateItemPricing(
        product.price,
        quantity,
        product.discount,
      );
      item.price = updatedPricing.price;
      item.subtotal = updatedPricing.subtotal;

      cart.items[itemIndex] = item;
      const savedCart = await cart.save();

      res.status(200).json({
        message: "Cart updated successfully.",
        data: savedCart,
      });
    } else {
      res.status(404).json({
        message: "Item not found in cart.",
      });
      return;
    }
  },

  removeItem: async (req: Request, res: Response) => {
    const { cartId } = req.params;
    const { productId } = req.body;

    const cart = await Cart.findById(cartId);

    if (!cart) throw new AppError(404, "Cart not found.");
    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
      throw new AppError(404, "Product not found.");
    }

    const newCart = cart.items.filter(
      (item) => !item.product.equals(existingProduct!._id),
    );

    cart.items = newCart;

    const savedCart = await cart.save();

    res.status(200).json({
      message: "Item removed from cart successfully.",
      data: savedCart,
    });
  },

  clearItem: async (req: Request, res: Response) => {
    const cart = await Cart.findOne({ user: req.user!._id });
    if (!cart) throw new AppError(404, "Cart not found.");

    cart.items = [];

    const savedCart = await cart.save();

    res.status(200).json({
      message: "All items have been cleared successfully.",
      data: savedCart,
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

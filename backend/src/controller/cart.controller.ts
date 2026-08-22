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

    if(product.quantity < quantity) throw new AppError(404, "Insufficient stock.");

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
    
    if(product.quantity < quantity) throw new AppError(404, "Insufficient stock.");

    // const existingItem = cart.items.find((item) =>
    //   item.product.equals(product._id),
    // );

    const item = cart.items.find((item) => item.product.equals(product._id));
    const itemIndex = cart.items.findIndex((item) =>
      item.product.equals(product._id),
    );

    if (item) {
      item.quantity = quantity;
      item.subtotal = item.price * quantity;

      cart.items[itemIndex] = item;
      const savedCart = await cart.save();

      res.status(200).json({
        message: "Cart updated succesfully.",
        data: savedCart,
      });
    } else {
      res.status(404).json({
        message: "Item not found.",
      });
      return;
    }

    // if (existingItem) {
    //   existingItem.quantity += quantity;
    //   existingItem.subtotal += quantity * existingItem.price;

    //   cart.items.push(existingItem);
    //   const updateCart = await cart.save();

    //   res.status(200).json({
    //     message: "Cart updated successfully.",
    //     data: updateCart,
    //   });
    // }
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
      message: "Delete item from card successfully.",
      data: savedCart,
    });
  },

  clearItem: async (req: Request, res: Response) => {
    const cart = await Cart.findOne({ user: req.user!._id });
    if (!cart) throw new AppError(400, "Cart not found.");

    cart.items = [];

    const savedCart = await cart.save();

    res.status(200).json({
      message: "All items have been clear successfully.",
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

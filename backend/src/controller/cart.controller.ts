import { Request, Response } from "express";
import Cart from "../models/cart.model.js";

export const cartController = {
  read: async (req: Request, res: Response) => {
    let cart = await Cart.findOne({ user: req.user!._id });
    if (!cart) {
      cart = await Cart.create({user: req.user!._id, items: []});
    } 
    res.status(200).json({data: cart});
  },
};

import { Request, Response } from "express";
import { Types } from "mongoose";
import { AppError } from "../types/AppError.js";
import User from "../models/user.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.models.js";
import Order, { IOrderItem } from "../models/order.model.js";
import { calculateItemPricing, calculatePricingSummary } from "../utils/pricing.util.js";

const getUserAndShipment = async (userId: string, addressId?: string) => {
  const user = await User.findById(userId);

  if (!user) throw new AppError(404, "User not found.");

  if (!user.addresses || user.addresses.length === 0) {
    throw new AppError(400, "User has no saved shipping addresses.");
  }

  const shipment = addressId
    ? user.addresses.find((address: any) => address._id.toString() === addressId)
    : user.addresses.find((address: any) => address.isDefault) || user.addresses[0];

  if (!shipment) throw new AppError(404, "Shipment address not found.");

  return { user, shipment };
};

const getCartForUser = async (userId: string) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart || cart.items.length === 0) {
    throw new AppError(400, "Cart is empty.");
  }

  return cart;
};

const getAvailableProducts = async (cart: any) => {
  const productIds = cart.items.map((item: any) => item.product);
  const products = await Product.find({
    _id: { $in: productIds },
  });

  if (products.length !== cart.items.length) {
    throw new AppError(400, "Some products in your cart are no longer available.");
  }

  return new Map(products.map((product) => [product._id.toString(), product]));
};

const buildOrderItems = async (cart: any, productMap: Map<string, any>) => {
  const orderItems: IOrderItem[] = [];
  let totalItemDiscount = 0;

  for (const cartItem of cart.items) {
    const product = productMap.get(cartItem.product.toString());

    if (!product) throw new AppError(404, "Product not found.");

    const quantity = Number(cartItem.quantity ?? 0);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      throw new AppError(400, "Invalid cart item quantity.");
    }

    if (product.quantity < quantity) {
      throw new AppError(400, `${product.name} does not have enough stock.`);
    }

    const unitPrice = Number(product.price ?? 0);
    const discount = Number(product.discount ?? 0);

    const pricing = calculateItemPricing(unitPrice, quantity, discount);
    totalItemDiscount += pricing.discountAmountPerUnit * pricing.quantity;

    orderItems.push({
      product: product._id as Types.ObjectId,
      variantSku: cartItem.variantSku || "",
      name: product.name,
      image: product.images?.[0] || "",
      price: pricing.price,
      quantity: pricing.quantity,
      subtotal: pricing.subtotal,
    });

    product.quantity -= quantity;
    await product.save();
  }

  return { orderItems, totalItemDiscount };
};

const createOrderRecord = async ({
  userId,
  shipment,
  orderItems,
  couponCode,
  shippingFee = 0,
}: {
  userId: string;
  shipment: any;
  orderItems: IOrderItem[];
  couponCode?: string;
  shippingFee?: number;
}) => {
  const summary = calculatePricingSummary({
    items: orderItems.map((item) => ({
      price: item.price,
      quantity: item.quantity,
    })),
    shippingFee,
  });

  return Order.create({
    user: new Types.ObjectId(userId),
    orderItems,
    shippingAddress: {
      fullName: shipment.fullName,
      phone: shipment.phone,
      address: shipment.address,
      city: shipment.city || "Phnom Penh",
      province: shipment.province || "",
      country: shipment.country || "Cambodia",
    },
    couponCode: couponCode || "",
    subtotal: summary.subtotal,
    discount: summary.discount,
    shippingFee: summary.shippingFee,
    total: summary.total,
    status: "PENDING",
  });
};

export const orderController = {
  create: async (req: Request, res: Response) => {
    try {
      const userId = req.user?._id;
      const { addressId, couponCode, shippingFee } = req.body;

      if (!userId) throw new AppError(401, "Unauthorized.");

      const { user, shipment } = await getUserAndShipment(
        userId.toString(),
        addressId,
      );
      const cart = await getCartForUser(userId.toString());
      const productMap = await getAvailableProducts(cart);
      const { orderItems } = await buildOrderItems(cart, productMap);

      const order = await createOrderRecord({
        userId: userId.toString(),
        shipment,
        orderItems,
        couponCode,
        shippingFee: Number(shippingFee) || 0,
      });

      cart.items = [] as any;
      cart.totalItems = 0;
      cart.totalPrice = 0;
      await cart.save();

      res.status(201).json({
        success: true,
        message: "Order created successfully.",
        data: order,
      });
    } catch (error: any) {
      throw error;
    }
  },

  getUserOrders: async (req: Request, res: Response) => {
    const userId = req.user?._id;
    if (!userId) throw new AppError(401, "Unauthorized.");

    const orders = await Order.find({ user: userId as any }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders,
    });
  },

  getOrderById: async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { id } = req.params;

    if (!userId) throw new AppError(401, "Unauthorized.");

    const order = await Order.findOne({ _id: id, user: userId as any });
    if (!order) throw new AppError(404, "Order not found.");

    res.status(200).json({
      success: true,
      data: order,
    });
  },
};

import { Request, Response } from "express";
import Order from "../models/order.model.js";
import Payment from "../models/payment.model.js";
import { AppError } from "../types/AppError.js";

export const paymentController = {
    create: async (req: Request, res: Response) => {
        const userId = req.user?._id;
        const { orderId } = req.body;
        if (!orderId) return res.status(400).json({ message: "Order id is required." });
        if (!userId) throw new AppError(404, "Unauthorize");

        const order = await Order.findOne({
            _id: orderId,
            user: userId,
        });

        if (!order) throw new AppError(404, "Order not found.");

        if (order.status !== "PENDING") throw new AppError(400, "Order cannot be paid.");

        const existsPayment = await Payment.findOne({
            order: orderId,
            status: "PENDING"
        });

        if (existsPayment) {
            return res.status(200).json({
                message: "Payment is already created.",
                data: existsPayment
            });
        }

        const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

        const newPayment = new Payment({
            order: order._id,
            status: "PENDING",
            transactionId,
            amount: order.total,
            currenty: "USD",
        });

        const savedPayment = await newPayment.save();

        return res.status(200).json({
            message: "Payment successfully.",
            data: savedPayment
        });
    },
}
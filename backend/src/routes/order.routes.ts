import { Router } from "express";
import { orderController } from "../controller/order.controller.js";
import { authenticat } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authenticat, orderController.getUserOrders);
router.post("/", authenticat, orderController.create);
router.get("/:id", authenticat, orderController.getOrderById);

export default router;

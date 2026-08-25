import { Router } from "express";
import { orderController } from "../controller/order.controller.js";
import { authenticat } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", authenticat, orderController.create);

export default router;

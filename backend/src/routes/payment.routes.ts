import { Router } from "express";
import { authenticat } from "../middleware/auth.middleware.js";
import { paymentController } from "../controller/payment.controller.js";

const router = Router();

router.post("/", authenticat, paymentController.create);

export default router;
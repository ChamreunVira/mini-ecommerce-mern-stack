import { Router } from "express";
import { cartController } from "../controller/cart.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { authenticat } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authenticat, asyncHandler(cartController.readCart));
router.post("/items", authenticat, asyncHandler(cartController.addItem))

export default router;

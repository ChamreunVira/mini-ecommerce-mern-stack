import { Router } from "express";
import { cartController } from "../controller/cart.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { authenticat } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authenticat, asyncHandler(cartController.readCart));
router.post("/items", authenticat, asyncHandler(cartController.addItem));
router.put("/items/:cartId", authenticat, asyncHandler(cartController.updateItem));
router.delete("/items/:cartId", authenticat, asyncHandler(cartController.removeItem));
router.post("/items/clear", authenticat, asyncHandler(cartController.clearItem));

export default router;

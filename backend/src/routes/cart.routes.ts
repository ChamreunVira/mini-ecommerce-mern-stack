import { Router } from "express";
import { cartController } from "../controller/cart.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(cartController.read));

export default router;
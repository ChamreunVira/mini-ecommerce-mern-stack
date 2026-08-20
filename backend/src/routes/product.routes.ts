import { Router } from "express";
import { productController } from "../controller/product.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(productController.getAll));
router.post("/", asyncHandler(productController.create));

export default router;
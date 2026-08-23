import { Router } from "express";
import { productController } from "../controller/product.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

//product
router.get("/", asyncHandler(productController.getAll));
router.post("/", asyncHandler(productController.create));
router.delete("/:id", asyncHandler(productController.delete));
router.get("/filter-price" , asyncHandler(productController.filterPrice));

//varaint
router.post("/:productId/varaints", asyncHandler(productController.createVariant));
router.patch("/:productId/varaints/:variantId", asyncHandler(productController.updateVaraint));
router.delete("/:productId/varaints/:variantId", asyncHandler(productController.deleteVaraint));

export default router;
import { Router } from "express";
import { categoryController } from "../controller/category.controller.js";
import { uploads } from "../config/multer.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.post("/", uploads.single("image"), asyncHandler(categoryController.create));
router.get("/", asyncHandler(categoryController.getAll));
router.get("/:id", asyncHandler(categoryController.getById));
router.put("/:id", uploads.single("image"), asyncHandler(categoryController.update));
router.delete("/:id", asyncHandler(categoryController.delete));

export default router;

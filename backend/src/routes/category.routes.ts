import { Router } from "express";
import { categoryController } from "../controller/category.controller.js";
import { uploads } from "../config/multer.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { authenticat, authorization } from "../middleware/auth.middleware.js";

const router = Router();

router.patch(
  "/",
  authenticat,
  authorization,
  uploads.single("image"),
  asyncHandler(categoryController.create),
);
router.get("/", asyncHandler(categoryController.getAll));
router.get("/:id", asyncHandler(categoryController.getById));
router.put(
  "/:id",
  uploads.single("image"),
  asyncHandler(categoryController.update),
);
router.patch("/:id/status", asyncHandler(categoryController.updateStatus));

export default router;

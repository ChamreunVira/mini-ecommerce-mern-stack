import { Router } from "express";
import { authController } from "../controller/auth.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { authenticat } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", asyncHandler(authController.register));
router.post("/login", asyncHandler(authController.login));
router.get("/me", authenticat, asyncHandler(authController.me));

export default router;

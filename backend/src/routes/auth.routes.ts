import { Router } from "express";
import router from "./category.routes.js";
import { authController } from "../controller/auth.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const rotuer = Router();

router.post("/register", asyncHandler(authController.register));
router.post("/login", asyncHandler(authController.login));

export default router;

import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { userController } from "../controller/user.controller.js";
import { authenticat } from "../middleware/auth.middleware.js";

const router = Router();

//address
router.get("/addresses", asyncHandler(userController.readAddresses));
router.post(
  "/addresses",
  authenticat,
  asyncHandler(userController.createAddress),
);
router.patch(
  "/addresses/:addressId",
  authenticat,
  asyncHandler(userController.updateAddress),
);
router.patch(
  "/addresses/:addressId/status",
  authenticat,
  asyncHandler(userController.updateStatus),
);
router.delete(
  "/addresses/:addressId",
  authenticat,
  asyncHandler(userController.deleteAddress),
);

export default router;

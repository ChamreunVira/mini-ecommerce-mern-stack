import { Router } from "express";
import { uploads } from "../config/multer.js";
import { uploadController } from "../controller/upload.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.post(
  "/",
  uploads.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  asyncHandler(uploadController.uploaded),
);

export default router;

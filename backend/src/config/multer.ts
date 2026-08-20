import { Request } from "express";
import multer from "multer";
import path from "node:path";
import { AppError } from "../types/AppError.js";

type DestinationCallback = (error: Error | null, destination: string) => void;
type FilenameCallback = (error: Error | null, destination: string) => void;

const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: DestinationCallback,
  ) => {
    cb(null, "uploads/");
  },
  filename: (req: Request, file: Express.Multer.File, cb: FilenameCallback) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`,
    );
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowType = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
  if (allowType.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(400, "Invalid file type. Only png, jpg, jpeg, webp are allowed."));
  }
};

export const uploads = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

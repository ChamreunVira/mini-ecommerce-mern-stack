import { Request, Response, Router } from "express";
import { uploads } from "../config/multer.js";

const router = Router();

router.post("/", uploads.array("images"), (req: Request, res: Response) => {
  const fileNames = Array.isArray(req.files)
    ? req.files.map((file: Express.Multer.File) => file.filename)
    : [];

  res.status(200).json({
    message: "Upload successfully.",
    data: fileNames,
  });
});

export default router;

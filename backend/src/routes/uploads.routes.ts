import { Request, Response, Router } from "express"
import { uploads } from "../config/multer.js";

const router = Router();


router.post("/" , uploads.array("images") , (req: Request, res: Response) => {
    console.log(req.file , req.files);
});

export default router; 
import { Request, Response } from "express";

export const uploadController = {
    uploaded: (req: Request, res: Response) => {
        res.status(200).json({
            message: "Upload successfully.",
            data: req.file,
        });
    }
}
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { CustomerJwtPayload } from "../types/index.js";

const SECRET =
  process.env.JWT_SECRET ||
  "sssssssssssssssfksnfjksjnfksn2kn52mn42kl4o9249092nsnsjsskfnsjkdfjksjdf";

export const authenticat = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({message: "Invalid or Token not found."});
  }

  try {
    const decoded = jwt.verify(token as string, SECRET) as CustomerJwtPayload;
    req.user = decoded;

    next();
  } catch (err: any) {
    res.status(401).json({ message: "Invalid or Expired token." });
  }
};

export const authorization = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user?.isAdmin) {
      res.status(401).json({
        message: "You don't have permission access this resource.",
      });
    }
    next();
  } catch (err: any) {
    res.status(401).json({ message: "Unthorization." });
  }
};

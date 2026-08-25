import jwt from "jsonwebtoken";
import { Types } from "mongoose";

const SECRET =
  process.env.JWT_SECRET ||
  "sssssssssssssssfksnfjksjnfksn2kn52mn42kl4o9249092nsnsjsskfnsjkdfjksjdf";
const EXPIRATION = Number(process.env.JWT_EXPIRATION) || 3;

export const generateToken = (userId: Types.ObjectId, isAdmin: boolean) => {
  return jwt.sign({ _id: userId, isAdmin }, SECRET, {
    expiresIn: EXPIRATION * 60 * 60,
  });
};

export const generateSku = (
  productName: string,
  color?: string,
  size?: string,
): string => {
  const productCode = productName
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const colorCode = color ? color.trim().toUpperCase().slice(0, 3) : "";

  const sizeCode = size ? size.trim().toUpperCase() : "";

  const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();

  return [productCode, colorCode, sizeCode, randomCode]
    .filter(Boolean)
    .join("-");
};

export * from "./pricing.util.js";


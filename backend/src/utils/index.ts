import jwt from "jsonwebtoken";
import { Types } from "mongoose";

const SECRET =
  process.env.JWT_SECRET ||
  "sssssssssssssssfksnfjksjnfksn2kn52mn42kl4o9249092nsnsjsskfnsjkdfjksjdf";
const EXPIRATION = Number(process.env.JWT_EXPIRATION) || 3;

export const generateToken = (
  userId: Types.ObjectId,
  isAdmin: boolean,
) => {
  return jwt.sign({ _id: userId, isAdmin }, SECRET, {
    expiresIn: EXPIRATION * 60 * 60,
  });
};

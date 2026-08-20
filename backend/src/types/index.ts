import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";

export interface CustomerJwtPayload extends JwtPayload {
  _id: Types.ObjectId;
  isAdmin: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: CustomerJwtPayload;
    }
  }
}

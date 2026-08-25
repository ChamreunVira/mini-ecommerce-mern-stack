import { model, Schema } from "mongoose";

interface IPayment {
  qrString: string;
  md5: string;
  transactionId: string;
  status: "UNPAID" | "PENDING" | "PAID" | "FAILED";
  amount: Number;
  currenty: "KHR" | "USD";
  qrExpiresAt: Date;
  paidAt: Date;
}

const paymentSchema = new Schema<IPayment>({
  qrString: {
    type: String,
    required: true,
  },
  md5: {
    type: String,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["UNPAID", "PEDING", "PAID", "FAILED"],
    default: "PENDING",
    required: true,
  },
  amount: {
    type: Number,
    default: 0.0,
    required: true,
  },
  currenty: {
    type: String,
    default: "USD",
    enum: ["USD", "KHR"],
    required: true,
  },
  qrExpiresAt: {
    type: Date,
    required: true,
  },
  paidAt: {
    type: Date,
  },
});

export default model<IPayment>("Payment", paymentSchema);

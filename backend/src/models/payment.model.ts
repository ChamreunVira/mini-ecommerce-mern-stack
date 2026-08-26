import { model, Schema } from "mongoose";

interface IPayment {
  order: Schema.Types.ObjectId;
  qrString?: string;
  md5?: string;
  transactionId: string;
  status: "UNPAID" | "PENDING" | "PAID" | "FAILED";
  amount: Number;
  currenty: "KHR" | "USD";
  qrExpiresAt?: Date;
  paidAt?: Date;
}

const paymentSchema = new Schema<IPayment>({
  order: {
    type: Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },
  qrString: {
    type: String,
  },
  md5: {
    type: String,
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
    index: true,
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
  },
  paidAt: {
    type: Date,
  },
});

export default model<IPayment>("Payment", paymentSchema);

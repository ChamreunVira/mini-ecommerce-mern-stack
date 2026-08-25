import { Document, model, Schema } from "mongoose";

export interface IAddress extends Document {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  country: string;
  isDefault: boolean;
}

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  email: string;
  hashPassword: string;
  gender?: string;
  telephone?: string;
  addresses?: IAddress[];
  province?: string;
  city?: string;
  country: string;
  isAdmin: boolean;
  status: boolean;
}

const addressSchema = new Schema<IAddress>(
  {
    fullName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      default: "Phnom Penh",
      required: true,
    },
    province: {
      type: String,
      min: 3,
      max: 30,
    },
    country: {
      type: String,
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { _id: true },
);

const userSchema = new Schema<IUser>(
  {
    firstname: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 30,
      required: true,
    },
    lastname: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 30,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },
    hashPassword: {
      type: String,
      minLength: 5,
      maxLength: 100,
      required: true,
    },
    gender: {
      type: String,
      enum: ["M", "F", "O"],
    },
    telephone: {
      type: String,
      minLength: 9,
      maxLength: 15,
    },
    province: {
      type: String,
    },
    country: {
      type: String,
      default: "Cambodia",
      required: true,
    },
    addresses: [addressSchema],
    isAdmin: {
      type: Boolean,
      default: false,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  { timestamps: true },
);

export default model("User", userSchema);

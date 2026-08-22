import { Document, model, Schema } from "mongoose";

export interface IAddress extends Document {
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
  addresses?: IAddress[];
  isAdmin: boolean;
}

const addressSchema = new Schema<IAddress>(
  {
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
      required: true,
    },
    province: {
      type: String,
      required: true,
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
      required: true,
    },
    hashPassword: {
      type: String,
      minLength: 5,
      maxLength: 100,
      required: true,
    },
    addresses: [addressSchema],
    isAdmin: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true },
);

export default model("User", userSchema);

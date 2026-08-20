import mongoose, { Document, model, Schema } from "mongoose";
export interface IProductVariant extends Document {
  color: string;
  size: "S" | "M" | "L" | "XL" | "2XL";
  price: number;
  quantity: number;
  image: string[];
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  quantity: number;
  discount?: number;
  images: string[];
  variants: IProductVariant[];
  category: mongoose.Schema.Types.ObjectId;
}

const productVariantSchema = new Schema<IProductVariant>({
  color: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    enum: ["S", "M", "L", "XL", "2XL"],
    require: true,
  },
  price: {
    type: Number,
    min: 0.0,
    required: true,
  },
  quantity: {
    type: Number,
    min: 0,
    required: true,
  },
  image: [
    {
      type: String,
      required: true,
    },
  ],
});

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      minLength: 3,
      maxLength: 50,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      minLength: 5,
      maxLength: 500,
      trim: true,
      required: true,
    },
    price: {
      type: Number,
      min: 0.0,
      required: true,
    },
    quantity: {
      type: Number,
      min: 0,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    variants: [productVariantSchema],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true },
);

export default model("Product", productSchema);

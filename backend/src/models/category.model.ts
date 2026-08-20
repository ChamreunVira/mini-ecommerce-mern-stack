import { Document, Schema, model } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  image: string;
  status: boolean;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      minLength: 3,
      maxlength: 30,
      trim: true,
      unique: true,
      required: true,
    },
    description: {
      type: String,
      minLength: 5,
      maxlength: 500,
    },
    image: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default model("Category", categorySchema);

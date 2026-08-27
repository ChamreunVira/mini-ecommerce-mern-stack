import { Document, Schema, model } from "mongoose";
import slugify from "slugify";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image: string;
  status: boolean;
  productCount: number;
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
    slug: {
      type: String,
      unique: true,
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

categorySchema.pre<ICategory>("save", function (this) {
  this.slug = slugify(this.name, {
    lower: true,
    strict: true,
    trim: true
  });
});

export default model("Category", categorySchema);
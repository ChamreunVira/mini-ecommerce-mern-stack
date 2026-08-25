import { nanoid } from "@reduxjs/toolkit";
import { Product, ProductVariant, ProductSize } from "@/types";
import { commit, FieldErrors, isBlank, outOfRange } from "./support";

export interface VariantInput {
  color: string;
  size: ProductSize;
  price: number;
  quantity: number;
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  discount: number;
  category: string;
  quantity: number;
  variants: VariantInput[];
  status: string;
  imageColor: string;
}

export const EMPTY_PRODUCT: ProductInput = {
  name: "",
  description: "",
  price: 0,
  discount: 0,
  category: "Unisex",
  quantity: 0,
  variants: [],
  status: "In Stock",
  imageColor: "#111827",
};

export function validateProduct(input: ProductInput): FieldErrors<ProductInput> {
  const errors: FieldErrors<ProductInput> = {};

  if (isBlank(input.name)) errors.name = "Product name is required.";
  if (isBlank(input.description)) errors.description = "Description is required.";
  if (outOfRange(input.price, 0.01)) {
    errors.price = "Price must be greater than 0.";
  }
  if (outOfRange(input.discount, 0, 100)) {
    errors.discount = "Discount must be between 0 and 100.";
  }
  if (outOfRange(input.quantity, 0)) errors.quantity = "Quantity cannot be negative.";
  if (isBlank(input.category)) errors.category = "Category is required.";

  return errors;
}

function toVariant(v: VariantInput): ProductVariant {
  return { id: nanoid(), images: [], ...v };
}

function normalize(input: ProductInput) {
  return {
    ...input,
    name: input.name.trim(),
    description: input.description.trim(),
    variants: input.variants.map(toVariant),
  };
}

export const productService = {
  create(input: ProductInput): Promise<Product> {
    return commit(validateProduct(input), () => ({
      id: nanoid(),
      images: [],
      ...normalize(input),
    }));
  },

  update(id: string, input: ProductInput): Promise<Product> {
    return commit(validateProduct(input), () => ({
      id,
      images: [],
      ...normalize(input),
    }));
  },

  remove(id: string): Promise<string> {
    return commit<ProductInput, string>({}, () => id);
  },

  setStatus(id: string, status: string): Promise<{ id: string; status: string }> {
    return commit<ProductInput, { id: string; status: string }>({}, () => ({ id, status }));
  },
};

export function toProductInput(product: Product): ProductInput {
  const { id: _id, images: _images, ...rest } = product;
  return {
    ...rest,
    variants: rest.variants.map(({ id: _vid, images: _vimages, ...v }) => v),
  };
}

/** Selling price after the percentage discount is applied. */
export function finalPrice(price: number, discount: number): number {
  return price - (price * discount) / 100;
}

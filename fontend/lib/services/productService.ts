import { nanoid } from "@reduxjs/toolkit";
import { Product } from "@/types";
import { commit, FieldErrors, isBlank, outOfRange } from "./support";

export interface ProductInput {
  name: string;
  basePrice: number;
  discount: number;
  category: string;
  collection: string;
  stock: number;
  code: string;
  status: string;
  image: string;
  imageColor: string;
}

export const EMPTY_PRODUCT: ProductInput = {
  name: "",
  basePrice: 0,
  discount: 0,
  category: "Unisex",
  collection: "No Collection",
  stock: 0,
  code: "",
  status: "In Stock",
  image: "tshirt",
  imageColor: "#111827",
};

export function validateProduct(input: ProductInput): FieldErrors<ProductInput> {
  const errors: FieldErrors<ProductInput> = {};

  if (isBlank(input.name)) errors.name = "Product name is required.";
  if (isBlank(input.code)) errors.code = "Product code is required.";
  if (outOfRange(input.basePrice, 0.01)) {
    errors.basePrice = "Base price must be greater than 0.";
  }
  if (outOfRange(input.discount, 0, 100)) {
    errors.discount = "Discount must be between 0 and 100.";
  }
  if (outOfRange(input.stock, 0)) errors.stock = "Stock cannot be negative.";
  if (isBlank(input.category)) errors.category = "Category is required.";

  return errors;
}

function normalize(input: ProductInput) {
  return {
    ...input,
    name: input.name.trim(),
    code: input.code.trim(),
  };
}

export const productService = {
  create(input: ProductInput): Promise<Product> {
    return commit(validateProduct(input), () => ({
      id: nanoid(),
      ...normalize(input),
    }));
  },

  update(id: string, input: ProductInput): Promise<Product> {
    return commit(validateProduct(input), () => ({
      id,
      ...normalize(input),
    }));
  },

  /** Soft delete — the products table renders "Deleted" rows struck through. */
  remove(id: string): Promise<string> {
    return commit<ProductInput, string>({}, () => id);
  },

  setStatus(id: string, status: string): Promise<{ id: string; status: string }> {
    return commit<ProductInput, { id: string; status: string }>({}, () => ({ id, status }));
  },
};

export function toProductInput(product: Product): ProductInput {
  const { id: _id, ...rest } = product;
  return rest;
}

/** Selling price after the percentage discount is applied. */
export function finalPrice(basePrice: number, discount: number): number {
  return basePrice - (basePrice * discount) / 100;
}

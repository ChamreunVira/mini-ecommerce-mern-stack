import { nanoid } from "@reduxjs/toolkit";
import { Coupon } from "@/types";
import { commit, FieldErrors, isBlank, outOfRange } from "./support";

export interface CouponInput {
  code: string;
  discountType: string;
  discount: number;
  maxUses: number;
  expiryDate: string;
  status: string;
}

export const EMPTY_COUPON: CouponInput = {
  code: "",
  discountType: "percentage",
  discount: 10,
  maxUses: 100,
  expiryDate: "",
  status: "Active",
};

export function validateCoupon(input: CouponInput): FieldErrors<CouponInput> {
  const errors: FieldErrors<CouponInput> = {};

  if (isBlank(input.code)) {
    errors.code = "Coupon code is required.";
  } else if (input.code.trim().length < 3) {
    errors.code = "Coupon code must be at least 3 characters.";
  }

  if (input.discountType === "percentage") {
    if (outOfRange(input.discount, 1, 100)) {
      errors.discount = "Percentage discount must be between 1 and 100.";
    }
  } else if (outOfRange(input.discount, 0.01)) {
    errors.discount = "Fixed discount must be greater than 0.";
  }

  if (outOfRange(input.maxUses, 1)) errors.maxUses = "Max uses must be at least 1.";
  if (isBlank(input.expiryDate)) errors.expiryDate = "Expiry date is required.";

  return errors;
}

function normalize(input: CouponInput) {
  return { ...input, code: input.code.trim().toUpperCase() };
}

export const couponService = {
  create(input: CouponInput): Promise<Coupon> {
    return commit(validateCoupon(input), () => ({
      id: nanoid(),
      totalUses: 0,
      ...normalize(input),
    }));
  },

  update(id: string, input: CouponInput, totalUses: number): Promise<Coupon> {
    return commit(validateCoupon(input), () => ({
      id,
      totalUses,
      ...normalize(input),
    }));
  },

  remove(id: string): Promise<string> {
    return commit<CouponInput, string>({}, () => id);
  },

  toggleStatus(id: string): Promise<string> {
    return commit<CouponInput, string>({}, () => id);
  },
};

export function toCouponInput(coupon: Coupon): CouponInput {
  return {
    code: coupon.code,
    discountType: coupon.discountType,
    discount: coupon.discount,
    maxUses: coupon.maxUses,
    expiryDate: coupon.expiryDate,
    status: coupon.status,
  };
}

/** A coupon is spent once it hits its cap, or past its expiry date. */
export function isExpired(coupon: Coupon): boolean {
  if (coupon.totalUses >= coupon.maxUses) return true;
  return new Date(coupon.expiryDate).getTime() < Date.now();
}

/**
 * Utility functions for pricing calculations across controllers (Cart, Order, Products, etc.)
 */

/**
 * Rounds a numeric amount to 2 decimal places to avoid floating point precision issues.
 */
export const roundCurrency = (amount: number): number => {
  if (!Number.isFinite(amount)) return 0;
  return Math.round((amount + Number.EPSILON) * 100) / 100;
};

export interface ItemPricingDetails {
  unitPrice: number;
  discount: number; // fractional or percentage
  discountAmountPerUnit: number;
  price: number; // price per unit after discount
  quantity: number;
  subtotal: number; // price * quantity
}

/**
 * Calculates pricing details for a single item.
 * @param unitPrice Base price per unit before item-level discount.
 * @param quantity Item quantity.
 * @param discount Item discount (fraction like 0.1 or percentage like 10).
 */
export const calculateItemPricing = (
  unitPrice: number,
  quantity: number,
  discount: number = 0,
): ItemPricingDetails => {
  const safeUnitPrice = Math.max(0, Number(unitPrice) || 0);
  const safeQty = Math.max(0, Math.floor(Number(quantity) || 0));
  const safeDiscount = Math.max(0, Number(discount) || 0);

  // Normalize discount (if > 1 assume percentage e.g. 15 -> 0.15, otherwise fraction 0.15)
  const discountRate = safeDiscount > 1 ? safeDiscount / 100 : safeDiscount;
  const clampedRate = Math.min(1, discountRate);

  const discountAmountPerUnit = roundCurrency(safeUnitPrice * clampedRate);
  const price = roundCurrency(safeUnitPrice - discountAmountPerUnit);
  const subtotal = roundCurrency(price * safeQty);

  return {
    unitPrice: roundCurrency(safeUnitPrice),
    discount: safeDiscount,
    discountAmountPerUnit,
    price,
    quantity: safeQty,
    subtotal,
  };
};

export interface OrderPricingSummaryInput {
  items: Array<{
    unitPrice?: number;
    price: number;
    quantity: number;
    discount?: number;
  }>;
  shippingFee?: number;
  couponDiscount?: number;
}

export interface OrderPricingSummary {
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
}

/**
 * Calculates subtotal, total discount, shipping fee, and grand total for order / cart summaries.
 */
export const calculatePricingSummary = ({
  items,
  shippingFee = 0,
  couponDiscount = 0,
}: OrderPricingSummaryInput): OrderPricingSummary => {
  let subtotal = 0;
  let totalItemDiscount = 0;

  for (const item of items) {
    if (item.unitPrice !== undefined && item.unitPrice > item.price) {
      // If unit price is explicit, item subtotal is based on price, and discount is (unitPrice - price) * quantity
      const itemSubtotal = roundCurrency(item.price * item.quantity);
      subtotal += itemSubtotal;
      totalItemDiscount += roundCurrency((item.unitPrice - item.price) * item.quantity);
    } else {
      const pricing = calculateItemPricing(
        item.price,
        item.quantity,
        item.discount ?? 0,
      );
      subtotal += pricing.subtotal;
      totalItemDiscount += roundCurrency(pricing.discountAmountPerUnit * pricing.quantity);
    }
  }

  const safeShippingFee = Math.max(0, roundCurrency(shippingFee));
  const safeCouponDiscount = Math.max(0, roundCurrency(couponDiscount));
  const totalDiscount = roundCurrency(totalItemDiscount + safeCouponDiscount);
  const total = Math.max(0, roundCurrency(subtotal + safeShippingFee - safeCouponDiscount));

  return {
    subtotal: roundCurrency(subtotal),
    discount: totalDiscount,
    shippingFee: safeShippingFee,
    total,
  };
};

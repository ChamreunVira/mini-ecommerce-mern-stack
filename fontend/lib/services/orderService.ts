import { commit, FieldErrors, isBlank } from "./support";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/types";

interface OrderStatusInput {
  status: string;
  paymentStatus: string;
}

/** Terminal states can't be moved on from. */
const LOCKED: string[] = ["cancelled", "delivered"];

export function canChangeStatus(current: string): boolean {
  return !LOCKED.includes(current);
}

export const orderService = {
  setStatus(id: string, status: string, current: string) {
    const errors: FieldErrors<OrderStatusInput> = {};
    if (isBlank(status) || !ORDER_STATUSES.includes(status as never)) {
      errors.status = "Unknown order status.";
    } else if (!canChangeStatus(current)) {
      errors.status = `A ${current} order can no longer change status.`;
    }
    return commit(errors, () => ({ id, status }));
  },

  setPaymentStatus(id: string, paymentStatus: string) {
    const errors: FieldErrors<OrderStatusInput> = {};
    if (!PAYMENT_STATUSES.includes(paymentStatus as never)) {
      errors.paymentStatus = "Unknown payment status.";
    }
    return commit(errors, () => ({ id, paymentStatus }));
  },
};

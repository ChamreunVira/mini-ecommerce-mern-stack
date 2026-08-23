import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { Coupon } from "@/types";

interface CouponsState {
  items: Coupon[];
}

const initialState: CouponsState = {
  items: [
    {
      id: "c1",
      code: "KDMV2027",
      discountType: "percentage",
      discount: 50,
      totalUses: 1,
      maxUses: 100,
      expiryDate: "2025-11-13",
      status: "Inactive",
    },
    {
      id: "c2",
      code: "KDMV2025",
      discountType: "percentage",
      discount: 50,
      totalUses: 1,
      maxUses: 2,
      expiryDate: "2025-11-09",
      status: "Inactive",
    },
  ],
};

const couponsSlice = createSlice({
  name: "coupons",
  initialState,
  reducers: {
    addCoupon: {
      reducer(state, action: PayloadAction<Coupon>) {
        state.items.unshift(action.payload);
      },
      prepare(coupon: Partial<Coupon> & Pick<Coupon, "code" | "discountType" | "discount" | "maxUses" | "expiryDate">) {
        return {
          payload: {
            id: nanoid(),
            totalUses: 0,
            status: "Active",
            ...coupon,
          } as Coupon,
        };
      },
    },
    toggleCouponStatus(state, action: PayloadAction<string>) {
      const item = state.items.find((c) => c.id === action.payload);
      if (item) item.status = item.status === "Active" ? "Inactive" : "Active";
    },
  },
});

export const { addCoupon, toggleCouponStatus } = couponsSlice.actions;
export default couponsSlice.reducer;

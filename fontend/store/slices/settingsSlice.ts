import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SettingsState } from "@/types";

const initialState: SettingsState = {
  storeName: "Kdmv",
  storeLogo: "",
  storeDescription: "Streetwear label out of Phnom Penh.",
  shippingFee: 2.5,
  taxRate: 0,
  currency: "USD",
  contactEmail: "hello@kdmv.com",
  contactPhone: "013222123",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateSettings(state, action: PayloadAction<Partial<SettingsState>>) {
      Object.assign(state, action.payload);
    },
  },
});

export const { updateSettings } = settingsSlice.actions;
export default settingsSlice.reducer;

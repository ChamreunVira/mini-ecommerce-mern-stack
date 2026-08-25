import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Toast, ToastType } from "@/types";

interface UIState {
  toasts: Toast[];
  searchOpen: boolean;
  mobileMenuOpen: boolean;
}

let toastId = 0;

const initialState: UIState = {
  toasts: [],
  searchOpen: false,
  mobileMenuOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showToast(state, action: PayloadAction<{ message: string; type?: ToastType }>) {
      const { message, type = "success" } = action.payload;
      state.toasts.push({ id: String(++toastId), type, message });
      if (state.toasts.length > 5) state.toasts.shift();
    },

    dismissToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },

    clearToasts(state) {
      state.toasts = [];
    },

    setSearchOpen(state, action: PayloadAction<boolean>) {
      state.searchOpen = action.payload;
    },

    setMobileMenuOpen(state, action: PayloadAction<boolean>) {
      state.mobileMenuOpen = action.payload;
    },
  },
});

export const { showToast, dismissToast, clearToasts, setSearchOpen, setMobileMenuOpen } =
  uiSlice.actions;
export default uiSlice.reducer;

import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "./slices/authSlice";
import productsReducer from "./slices/productsSlice";
import couponsReducer from "./slices/couponsSlice";
import usersReducer from "./slices/usersSlice";
import bannersReducer from "./slices/bannersSlice";
import ordersReducer from "./slices/ordersSlice";
import dashboardReducer from "./slices/dashboardSlice";
import settingsReducer from "./slices/settingsSlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import categoryReducer from "./slices/categorySlice";
import uiReducer from "./slices/uiSlice";

export function makeStore() {
  const categoryReducerInstance =
    "reducer" in categoryReducer ? categoryReducer.reducer : categoryReducer;

  return configureStore({
    reducer: {
      auth: authReducer,
      categories: categoryReducer,
      products: productsReducer,
      coupons: couponsReducer,
      users: usersReducer,
      banners: bannersReducer,
      orders: ordersReducer,
      dashboard: dashboardReducer,
      settings: settingsReducer,
      cart: cartReducer,
      wishlist: wishlistReducer,
      ui: uiReducer,
    },
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

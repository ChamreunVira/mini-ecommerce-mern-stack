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

export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      products: productsReducer,
      coupons: couponsReducer,
      users: usersReducer,
      banners: bannersReducer,
      orders: ordersReducer,
      dashboard: dashboardReducer,
      settings: settingsReducer,
    },
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

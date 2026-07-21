import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slice/cartSlice";
import ordersReducer from "./slice/orderSlice";
import checkoutReducer from "./slice/checkoutSlice";

export const store = configureStore({
  reducer: {
    cartSlice: cartReducer,
    ordersSlice: ordersReducer,
    checkoutSlice: checkoutReducer,
  },
});

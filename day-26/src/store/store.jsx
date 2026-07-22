import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slice/cartSlice";
import ordersReducer from "./slice/orderSlice";
import checkoutReducer from "./slice/checkoutSlice";
import productReducer from "./slice/productSlice";

export const store = configureStore({
  reducer: {
    productSlice: productReducer,
    cartSlice: cartReducer,
    ordersSlice: ordersReducer,
    checkoutSlice: checkoutReducer,
  },
});

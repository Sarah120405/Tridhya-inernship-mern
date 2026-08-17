import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slice/cartSlice";
import ordersReducer from "./slice/orderSlice";
import productReducer from "./slice/productSlice";
import reportReducer from "./slice/reportSlice";
export const store = configureStore({
  reducer: {
    productSlice: productReducer,
    cartSlice: cartReducer,
    ordersSlice: ordersReducer,
    reportSlice: reportReducer,
  },
});

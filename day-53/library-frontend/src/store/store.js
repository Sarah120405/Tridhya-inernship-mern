import { configureStore } from "@reduxjs/toolkit";
import bookReducer from "./slice/bookSlice";
import authorReducer from "./slice/authorSlice";

export const store = configureStore({
  reducer: {
    bookSlice: bookReducer,
    authorSlice: authorReducer,
  },
});

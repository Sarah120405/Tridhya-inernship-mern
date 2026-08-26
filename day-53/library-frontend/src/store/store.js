import { configureStore } from "@reduxjs/toolkit";
import bookReducer from "./slice/bookSlice";
import authorReducer from "./slice/authorSlice";
import borrowReducer from "./slice/borrowSlice";
import memberReducer from "./slice/memberSlice";

export const store = configureStore({
  reducer: {
    bookSlice: bookReducer,
    authorSlice: authorReducer,
    borrowSlice: borrowReducer,
    memberSlice: memberReducer,
  },
});

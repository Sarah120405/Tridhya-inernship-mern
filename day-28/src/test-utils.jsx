import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./store/slice/cartSlice";

export function renderWithStore(ui, { preloadedState } = {}) {
  const store = configureStore({
    reducer: { cartSlice: cartReducer },
    preloadedState,
  });
  return render(<Provider store={store}>{ui}</Provider>);
}

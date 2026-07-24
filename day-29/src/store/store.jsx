import { configureStore } from "@reduxjs/toolkit";
import transactionReducer from "./slice/transactionSlice";

const STORAGE_KEY = "finance-transactions";

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { transactionSlice: JSON.parse(stored) } : undefined;
  } catch {
    return undefined;
  }
}

export const store = configureStore({
  reducer: {
    transactionSlice: transactionReducer,
  },
  preloadedState: loadState(),
});

store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.transactionSlice));
});
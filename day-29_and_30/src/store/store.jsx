import { configureStore } from "@reduxjs/toolkit";
import transactionReducer from "./slice/transactionSlice";
import budgetReducer from "./slice/budgetSlice";

const TRANSACTIONS_KEY = "finance-transactions";
const BUDGETS_KEY = "finance-budgets";

function loadState() {
  try {
    const transactions = localStorage.getItem(TRANSACTIONS_KEY);
    const budgets = localStorage.getItem(BUDGETS_KEY);

    return {
      transactionSlice: transactions ? JSON.parse(transactions) : undefined,
      budgetSlice: budgets ? JSON.parse(budgets) : undefined,
    };
  } catch {
    return undefined;
  }
}

export const store = configureStore({
  reducer: {
    transactionSlice: transactionReducer,
    budgetSlice: budgetReducer,
  },
  preloadedState: loadState(),
});

store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem(
    TRANSACTIONS_KEY,
    JSON.stringify(state.transactionSlice),
  );
  localStorage.setItem(BUDGETS_KEY, JSON.stringify(state.budgetSlice));
});

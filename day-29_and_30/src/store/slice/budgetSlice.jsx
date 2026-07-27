import { createSlice } from "@reduxjs/toolkit";

const budgetSlice = createSlice({
  name: "budgetSlice",
  initialState: {
    budgets: [],
  },
  reducers: {
    setBudget: (state, action) => {
      const existing = state.budgets.find(
        (b) => b.category === action.payload.category,
      );
      if (existing) {
        Object.assign(existing, action.payload);
      } else {
        state.budgets.push(action.payload);
      }
    },
    deleteBudget: (state, action) => {
      state.budgets = state.budgets.filter(
        (b) => b.category !== action.payload,
      );
    },
  },
});

export const { setBudget, deleteBudget } = budgetSlice.actions;
export default budgetSlice.reducer;

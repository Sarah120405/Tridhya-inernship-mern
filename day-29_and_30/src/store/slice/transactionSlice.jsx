import { createSlice } from "@reduxjs/toolkit";

const transactionSlice = createSlice({
  name: "transactionSlice",
  initialState: {
    transactions: [],
  },
  reducers: {
    addTransaction: (state, action) => {
      const id = crypto.randomUUID();
      state.transactions.push({ id, ...action.payload });
    },
    deleteTransaction: (state, action) => {
      console.log("Slice called");

      state.transactions = state.transactions.filter(
        (t) => t.id !== action.payload,
      );
    },
    updateTransaction: (state, action) => {
      const transaction = state.transactions.find(
        (t) => t.id === action.payload.id,
      );
      if (transaction) {
        Object.assign(transaction, action.payload.updates);
      }
    },
  },
});

export const { addTransaction, deleteTransaction, updateTransaction } =
  transactionSlice.actions;
export default transactionSlice.reducer;

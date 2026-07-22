import { createSlice } from "@reduxjs/toolkit";

const ordersSlice = createSlice({
  name: "ordersSlice",
  initialState: {
    list: [],
  },
  reducers: {
    placeOrder: (state, action) => {
      const { items, total, address } = action.payload;
      state.list.push({
        id: Date.now(),
        items,
        total,
        address,
        placedAt: new Date().toISOString(),
      });
    },
  },
});

export const { placeOrder } = ordersSlice.actions;
export default ordersSlice.reducer;

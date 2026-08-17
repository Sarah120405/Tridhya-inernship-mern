import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const checkOut = createAsyncThunk(
  "orders/checkout",
  async (shippingAddress, { rejectWithValue }) => {
    const res = await fetch("http://localhost:5000/api/order/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ shippingAddress }),
    });
    if (!res.ok) {
      const data = await res.json();
      return rejectWithValue(data.error || "Checkout failed");
    }
    return res.json();
  },
);

export const fetchMyOrders = createAsyncThunk(
  "orders/fetchMyOrders",
  async () => {
    const res = await fetch("http://localhost:5000/api/order/my-orders", {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch orders");
    return res.json();
  },
);

const orderSlice = createSlice({
  name: "orders",
  initialState: { items: [], currentOrder: null, loading: false, error: null },
  reducers: {
    clearOrderError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkOut.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(checkOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;

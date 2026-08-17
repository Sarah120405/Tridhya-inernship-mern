import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchReports = createAsyncThunk(
  "reports/fetchReports",
  async () => {
    const [statusRes, lowStockRes, revenueRes, bestSellersRes, categoryRes] =
      await Promise.all([
        fetch("http://localhost:5000/api/report/order-status", {
          credentials: "include",
        }),
        fetch("http://localhost:5000/api/report/low-stock?threshold=20", {
          credentials: "include",
        }),
        fetch("http://localhost:5000/api/report/revenue-over-time", {
          credentials: "include",
        }),
        fetch("http://localhost:5000/api/report/best-sellers", {
          credentials: "include",
        }),
        fetch("http://localhost:5000/api/report/revenue-by-category", {
          credentials: "include",
        }),
      ]);

    const [
      orderStatus,
      lowStock,
      revenueOverTime,
      bestSellers,
      revenueByCategory,
    ] = await Promise.all([
      statusRes.json(),
      lowStockRes.json(),
      revenueRes.json(),
      bestSellersRes.json(),
      categoryRes.json(),
    ]);

    return {
      orderStatus,
      lowStock,
      revenueOverTime,
      bestSellers,
      revenueByCategory,
    };
  },
);

const reportSlice = createSlice({
  name: "reports",
  initialState: {
    orderStatus: [],
    lowStock: [],
    revenueOverTime: [],
    bestSellers: [],
    revenueByCategory: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default reportSlice.reducer;

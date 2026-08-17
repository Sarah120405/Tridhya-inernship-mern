import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk(
  "/products/fetchProducts",
  async () => {
    const res = await fetch("http://localhost:5000/api/product/all/", {
      credentials: "include",
    });
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    const data = await res.json();

    return data.map((product) => ({
      id: product._id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      description: product.description,
    }));
  },
);
const productSlice = createSlice({
  name: "productSlice",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk(
  "/products/fetchProducts",
  async () => {
    const res = await fetch("https://fakestoreapi.com/products");
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    const data = await res.json();

    return data.map((product) => ({
      id: product.id,
      name: product.title,
      category: product.category,
      price: product.price,
      image: product.image,
      rating: product.rating.rate,
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

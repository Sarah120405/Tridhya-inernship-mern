import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const res = await fetch("http://localhost:5000/api/cart", {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
});

export const addItem = createAsyncThunk(
  "cart/addItem",
  async ({ productId, quantity = 1 }) => {
    const res = await fetch(`http://localhost:5000/api/cart/${productId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ quantity }),
    });
    if (!res.ok) throw new Error("Failed to fetch cart");
    return res.json();
  },
);

export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ productId, quantity }) => {
    const res = await fetch(`http://localhost:5000/api/cart/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ quantity }),
    });
    if (!res.ok) throw new Error("Failed to update quantity");
    return res.json();
  },
);

export const removeItem = createAsyncThunk(
  "cart/removeItem",
  async (productId) => {
    const res = await fetch(`http://localhost:5000/api/cart/${productId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to remove item");
    return res.json();
  },
);

const cartSlice = createSlice({
  name: "cartSlice",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    /* addItem: (state, action) => {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeItem: (state, action) => {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing.quantity > 1) {
        existing.quantity -= 1;
      } else {
        state.items = state.items.filter((i) => i.id !== action.payload.id);
      }
    },
    updateQuantity: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) item.quantity = action.payload.quantity;
    },
    clearCart: (state) => {
      state.items = [];
    }, */
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addMatcher(
        (action) =>
          [
            addItem.fulfilled.type,
            updateQuantity.fulfilled.type,
            removeItem.fulfilled.type,
          ].includes(action.type),
        (state, action) => {
          state.items = action.payload.items;
        },
      );
  },
});

export default cartSlice.reducer;

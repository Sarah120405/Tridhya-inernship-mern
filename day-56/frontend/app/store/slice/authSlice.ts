import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData) => {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to register user");
    }
    return res.json();
  },
);

export const login = createAsyncThunk("/auth/login", async (userData) => {
  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to login user");
  }
  return res.json();
});

export const logOut = createAsyncThunk("/auth/logout", async () => {
  const res = await fetch("http://localhost:5000/api/auth/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to logout user");
  }
  return res.json();
});

const bookSlice = createSlice({
  name: "bookSlice",
  initialState: { message: null, user: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.message = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

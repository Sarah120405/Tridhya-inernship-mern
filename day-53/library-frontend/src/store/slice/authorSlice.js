import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchAuthors = createAsyncThunk(
  "authors/fetchAuthors",
  async () => {
    const res = await fetch("http://localhost:5000/api/author/all");
    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }
    return res.json();
  },
);

const authorSlice = createSlice({
  name: "authorSlice",
  initialState: {
    authors: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuthors.fulfilled, (state, action) => {
        state.loading = false;
        state.authors = action.payload;
      })
      .addCase(fetchAuthors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default authorSlice.reducer;

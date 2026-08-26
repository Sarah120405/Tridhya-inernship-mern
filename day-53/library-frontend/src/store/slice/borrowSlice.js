import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const borrowBook = createAsyncThunk(
  "borrow/borrowBook",
  async ({ bookId, memberId }) => {
    const res = await fetch(
      `http://localhost:5000/api/borrow_record/borrow/${bookId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: memberId }),
      },
    );
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to mark borow");
    }
    return res.json();
  },
);

export const returnBook = createAsyncThunk(
  "borrow/returnBook",
  async (recordId) => {
    const res = await fetch(
      `http://localhost:5000/api/borrow_record/return/${recordId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
    );
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to return book");
    }
    return res.json();
  },
);

export const fetchActiveBorrowRecords = createAsyncThunk(
  "borrow/fetchActiveBorrowRecords",
  async () => {
    const res = await fetch(
      `http://localhost:5000/api/borrow_record/active_borrow`,
    );
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to fetch borrow records");
    }
    return res.json();
  },
);

export const fetchBorrowingTrends = createAsyncThunk(
  "borrow/getBorrowingTrends",
  async () => {
    const res = await fetch(
      `http://localhost:5000/api/borrow_record/borrowing_trends`,
    );
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to fetch borrowing trends");
    }
    return res.json();
  },
);
const borrowSlice = createSlice({
  name: "borrow",
  initialState: {
    loading: false,
    error: null,
    message: null,
    activeBorrowRecords: [],
    borrowingTrends: [],
  },
  reducers: {
    clearMessage(state) {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(borrowBook.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(borrowBook.fulfilled, (state, action) => {
        state.activeBorrowRecords.push(action.payload);
        state.message = "Book Borrowed Successfully";
        state.loading = false;
      })
      .addCase(borrowBook.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(returnBook.fulfilled, (state, action) => {
        state.message = action.payload.message;
      })
      .addCase(fetchActiveBorrowRecords.fulfilled, (state, action) => {
        state.activeBorrowRecords = action.payload;
      })
      .addCase(fetchBorrowingTrends.fulfilled, (state, action) => {
        state.borrowingTrends = action.payload;
      });
  },
});

export default borrowSlice.reducer;
export const { clearMessage } = borrowSlice.actions;

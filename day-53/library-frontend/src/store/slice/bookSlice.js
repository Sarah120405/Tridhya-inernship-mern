import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchBooks = createAsyncThunk("books/fetchBooks", async () => {
  const response = await fetch("http://localhost:5000/api/book/");
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  return response.json();
});

export const fetchOverdueBooks = createAsyncThunk(
  "books/fetchOverdueBooks",
  async () => {
    const response = await fetch(
      "http://localhost:5000/api/book/overdue_books/",
    );
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
  },
);

export const fetchBookStatistics = createAsyncThunk(
  "books/fetchBookStatistics",
  async () => {
    const response = await fetch(
      "http://localhost:5000/api/book/book_statistics/",
    );
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
  },
);

export const fetchMostBorrowedBooks = createAsyncThunk(
  "books/fetchMostBorrowedBooks",
  async () => {
    const response = await fetch(
      "http://localhost:5000/api/book/most_borrowed",
    );
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
  },
);

export const createBook = createAsyncThunk(
  "books/createBook",
  async (bookData) => {
    const res = await fetch("http://localhost:5000/api/book/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookData),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to create book");
    }
    return res.json();
  },
);

export const updateBook = createAsyncThunk(
  "books/updateBook",
  async ({ bookId, bookData }) => {
    const res = await fetch(`http://localhost:5000/api/book/${bookId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookData),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to create book");
    }
    const response = await res.json();
    return response;
  },
);

export const deleteBook = createAsyncThunk(
  "book/deleteBook",
  async (bookId) => {
    const res = await fetch(`http://localhost:5000/api/book/${bookId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to create book");
    }
    const response = await res.json();
    return bookId;
  },
);
const bookSlice = createSlice({
  name: "books",
  initialState: {
    items: [],
    overdueBooks: [],
    mostBorrowed: [],
    statistics: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchOverdueBooks.fulfilled, (state, action) => {
        state.overdueBooks = action.payload;
      })
      .addCase(fetchBookStatistics.fulfilled, (state, action) => {
        state.statistics = action.payload;
      })
      .addCase(fetchMostBorrowedBooks.fulfilled, (state, action) => {
        state.mostBorrowed = action.payload;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        const index = state.items.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.items = state.items.filter((b) => b.id !== action.payload);
      });
  },
});

export default bookSlice.reducer;

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

export const fetchProfilicAuthors = createAsyncThunk(
  "authors/fetchProfilicAuthors",
  async () => {
    const res = await fetch("http://localhost:5000/api/author/profilic_author");
    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }
    return res.json();
  },
);

export const fetchNoBookBorrowedAuthors = createAsyncThunk(
  "authors/fetchNoBookBorrowedAuthors",
  async () => {
    const res = await fetch(
      "http://localhost:5000/api/author/no_book_borrowed",
    );
    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }
    return res.json();
  },
);

export const fetchMostBookBorrowedAuthors = createAsyncThunk(
  "authors/fetchMostBookBorrowedAuthors",
  async () => {
    const res = await fetch(
      "http://localhost:5000/api/author/author_most_borrow",
    );
    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }
    return res.json();
  },
);

export const fetchAuthorById = createAsyncThunk(
  "authors/fetchAuthorById",
  async (authorId) => {
    const res = await fetch(`http://localhost:5000/api/author/${authorId}`);
    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }
    return res.json();
  },
);

export const createAuthor = createAsyncThunk(
  "authors/createAuthors",
  async (authorData) => {
    const res = await fetch("http://localhost:5000/api/author/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authorData),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to create author");
    }
    return res.json();
  },
);

export const editAuthors = createAsyncThunk(
  "members/editAuthors",
  async ({ authorId, authorData }) => {
    const res = await fetch(`http://localhost:5000/api/author/${authorId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authorData),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to update author");
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
    profilicAuthors: [],
    noBookBorrowedAuthors: [],
    mostBookBorrowedAuthors: [],
    authorById: [],
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
      })
      .addCase(fetchProfilicAuthors.fulfilled, (state, action) => {
        state.profilicAuthors = action.payload;
      })
      .addCase(fetchMostBookBorrowedAuthors.fulfilled, (state, action) => {
        state.mostBookBorrowedAuthors = action.payload;
      })
      .addCase(fetchNoBookBorrowedAuthors.fulfilled, (state, action) => {
        state.noBookBorrowedAuthors = action.payload;
      })
      .addCase(createAuthor.fulfilled, (state, action) => {
        state.authors.push(action.payload);
      })
      .addCase(fetchAuthorById.fulfilled, (state, action) => {
        state.authorById = action.payload;
      })
      .addCase(editAuthors.fulfilled, (state, action) => {
        const index = state.authors.findIndex(
          (b) => b.id === action.payload.id,
        );
        if (index !== -1) {
          state.authors[index] = action.payload;
        }
      });
  },
});

export default authorSlice.reducer;

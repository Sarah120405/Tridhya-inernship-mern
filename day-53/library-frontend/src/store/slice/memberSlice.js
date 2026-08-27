import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchMembers = createAsyncThunk(
  "members/fetchMembers",
  async () => {
    const res = await fetch("http://localhost:5000/api/member/all");
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to fetch members");
    }
    return res.json();
  },
);

export const fetchMemberById = createAsyncThunk(
  "members/fetchMemberById",
  async (memberId) => {
    const res = await fetch(`http://localhost:5000/api/member/${memberId}`);
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to fetch member's data");
    }
    return res.json();
  },
);

export const fetchMembersBorrowSummary = createAsyncThunk(
  "members/fetchMembersBorrowSummary",
  async (memberId) => {
    const res = await fetch(
      `http://localhost:5000/api/member/borrow_summary/${memberId}`,
    );
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to fetch member's borrow summary");
    }
    return res.json();
  },
);

export const fetchActiveMembers = createAsyncThunk(
  "members/fetchActiveMembers",
  async () => {
    const res = await fetch("http://localhost:5000/api/member/active_members");
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to fetch members");
    }
    return res.json();
  },
);

export const createMembers = createAsyncThunk(
  "members/createMembers",
  async (memberData) => {
    const res = await fetch("http://localhost:5000/api/member/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(memberData),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to create member");
    }
    return res.json();
  },
);

export const editMembers = createAsyncThunk(
  "members/editMembers",
  async ({ memberId, memberData }) => {
    const res = await fetch(`http://localhost:5000/api/member/${memberId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(memberData),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to update member");
    }
    return res.json();
  },
);

const memberSlice = createSlice({
  name: "memberSlice",
  initialState: {
    members: [],
    loading: false,
    error: null,
    memberById: [],
    activeMembers: [],
    membersBorrowSummary: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembers.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.members = action.payload;
        state.loading = false;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchMemberById.fulfilled, (state, action) => {
        state.memberById = action.payload;
        state.loading = false;
      })
      .addCase(fetchActiveMembers.fulfilled, (state, action) => {
        state.activeMembers = action.payload;
        state.loading = false;
      })
      .addCase(fetchMembersBorrowSummary.fulfilled, (state, action) => {
        state.membersBorrowSummary = action.payload;
        state.loading = false;
      })
      .addCase(createMembers.fulfilled, (state, action) => {
        state.members.push(action.payload);
      })
      .addCase(editMembers.fulfilled, (state, action) => {
        const index = state.members.findIndex(
          (b) => b.id === action.payload.id,
        );
        if (index !== -1) {
          state.members[index] = action.payload;
        }
      });
  },
});

export default memberSlice.reducer;

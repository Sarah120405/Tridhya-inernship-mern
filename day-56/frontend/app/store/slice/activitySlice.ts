import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL = "http://localhost:5000/api";

export interface TicketActivityUser {
  id: string;
  name: string;
  role: "Customer" | "SupportAgent" | "Developer" | "Admin";
}

export interface TicketActivity {
  id: string;
  ticketId: string;
  userId: string;
  action: string;
  createdAt: string;
  user?: TicketActivityUser | null;
}

interface ActivityResponse {
  success: boolean;
  message: string;
  data: TicketActivity[];
}

interface ActivityState {
  activities: TicketActivity[];
  isLoading: boolean;
  error: string | null;
  activityTicketId: string | null;
}

const initialState: ActivityState = {
  activities: [],
  isLoading: false,
  error: null,
  activityTicketId: null,
};

export const fetchTicketActivity = createAsyncThunk<
  ActivityResponse,
  string,
  { rejectValue: string }
>("activity/fetchTicketActivity", async (ticketId, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/tickets/${ticketId}/activity`, {
      method: "GET",
      credentials: "include",
    });

    const data: ActivityResponse = await response.json();

    if (!response.ok) {
      return rejectWithValue(
        data.message || "Failed to fetch ticket activity.",
      );
    }

    return data;
  } catch (error) {
    console.error("Fetch ticket activity error:", error);

    return rejectWithValue(
      "Unable to fetch ticket activity. Please try again.",
    );
  }
});

const activitySlice = createSlice({
  name: "activity",

  initialState,

  reducers: {
    clearActivity: (state) => {
      state.activities = [];
      state.error = null;
      state.activityTicketId = null;
    },

    clearActivityError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTicketActivity.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        state.activityTicketId = action.meta.arg;
      })
      .addCase(fetchTicketActivity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activities = action.payload.data;
        state.error = null;
        state.activityTicketId = action.meta.arg;
      })
      .addCase(fetchTicketActivity.rejected, (state, action) => {
        state.isLoading = false;
        state.activities = [];
        state.error = action.payload || "Failed to fetch ticket activity.";
        state.activityTicketId = action.meta.arg;
      });
  },
});

export const { clearActivity, clearActivityError } = activitySlice.actions;
export default activitySlice.reducer;

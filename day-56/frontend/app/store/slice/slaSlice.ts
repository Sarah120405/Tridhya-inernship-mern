import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_URL } from "../../lib/api";

export interface SLA {
  id: string;
  ticketId: string;

  dueAt: string;

  breached: boolean;
  breachedAt: string | null;

  createdAt: string;
  updatedAt: string;

  firstRespondedAt: string | null;
  firstResponseDueAt: string | null;

  resolutionCompletedAt: string | null;
  resolutionDueAt: string | null;

  firstResponseWarningSentAt: string | null;
  resolutionWarningSentAt: string | null;

  ticket: {
    id: string;
    ticketNumber: number;
    title: string;
    description?: string;
    priority: string;
    status: string;

    customerId: string;
    assignedAgentId: string | null;
    assignedDeveloperId: string | null;

    customer?: {
      id: string;
      name: string;
    } | null;

    assignedAgent?: {
      id: string;
      name: string;
    } | null;

    assignedDeveloper?: {
      id: string;
      name: string;
    } | null;
  };
}

interface SLAResponse {
  success: boolean;
  message: string;
  data: {
    data: SLA[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

interface SLAByTicketIdResponse {
  success: boolean;
  message: string;
  data: SLA;
}

interface SLAState {
  slas: SLA[];
  slaByTicket: SLA | null;
  pagination: SLAResponse["data"]["pagination"] | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SLAState = {
  slas: [],
  slaByTicket: null,
  pagination: null,
  isLoading: false,
  error: null,
};

export interface SLAFilters {
  page: number;
  limit: number;
  priority?: string;
  search?: string;
}

export const fetchSLAs = createAsyncThunk<
  SLAResponse,
  SLAFilters,
  { rejectValue: string }
>(
  "sla/fetchSLAs",
  async ({ page, limit, priority, search }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (priority) params.set("priority", priority);
      if (search) params.set("search", search);

      const response = await fetch(`${API_URL}/sla?${params.toString()}`, {
        method: "GET",
        credentials: "include",
      });

      const data: SLAResponse = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to fetch SLA records.");
      }

      return data;
    } catch (error) {
      console.error("Fetch SLA error:", error);

      return rejectWithValue("Unable to fetch SLA records. Please try again.");
    }
  },
);

export const fetchSLAByTicketId = createAsyncThunk<
  SLAByTicketIdResponse,
  { ticketId: string },
  { rejectValue: string }
>("sla/fetchSLAByTicketId", async ({ ticketId }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/sla/${ticketId}`, {
      method: "GET",
      credentials: "include",
    });

    const data: SLAByTicketIdResponse = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || "Failed to fetch SLA record.");
    }

    return data;
  } catch (error) {
    console.error("Fetch SLA by ticket ID error:", error);

    return rejectWithValue("Unable to fetch SLA record. Please try again.");
  }
});

const slaSlice = createSlice({
  name: "sla",

  initialState,

  reducers: {
    clearSLA: (state) => {
      state.slas = [];
      state.error = null;
    },

    clearSLAError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchSLAs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchSLAs.fulfilled, (state, action) => {
        state.isLoading = false;

        state.slas = action.payload.data.data;
        state.pagination = action.payload.data.pagination;

        state.error = null;
      })

      .addCase(fetchSLAs.rejected, (state, action) => {
        state.isLoading = false;
        state.slas = [];
        state.error = action.payload || "Failed to fetch SLA records.";
      });
    builder
      .addCase(fetchSLAByTicketId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchSLAByTicketId.fulfilled, (state, action) => {
        state.isLoading = false;

        state.slaByTicket = action.payload.data ? action.payload.data : null;
        state.error = null;
      })

      .addCase(fetchSLAByTicketId.rejected, (state, action) => {
        state.isLoading = false;
        state.slaByTicket = null;
        state.error = action.payload || "Failed to fetch SLA record.";
      });
  },
});

export const { clearSLA, clearSLAError } = slaSlice.actions;

export default slaSlice.reducer;

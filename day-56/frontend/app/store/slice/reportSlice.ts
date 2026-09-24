import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL = "http://localhost:5000/api";

interface TicketStatistics {
  totalTickets: number;
  openTickets: number;
  inProgress: number;
  resolved: number;
  closed: number;
  escalated: number;
}

interface TicketDistributionItem {
  category?: string;
  priority?: string;
  status?: string;
  _count: {
    id: number;
  };
}
interface TicketDistribution {
  ticketByCategory: TicketDistributionItem[];
  ticketByPriority: TicketDistributionItem[];
  ticketByStatus: TicketDistributionItem[];
}

interface TrendItem {
  date: string;
  tickets: number;
}

interface TicketTrends {
  createdAtTrend: TrendItem[];
  resolvedAtTrend: TrendItem[];
  closedAtTrend: TrendItem[];
}

interface TeamPerformanceTickets {
  id: string;
  status: string;
  createdAt: string;
  resolvedAt: string | null;
}
interface TeamPerformance {
  userId: string;
  name: string;
  email: string;
  role: "SupportAgent" | "Developer";
  totalAssigned: number;
  resolvedTickets: TeamPerformanceTickets[];
  closedTickets: TeamPerformanceTickets[];
  activeTickets: TeamPerformanceTickets[];
  slaBreaches: number;
  averageResolutionHours: number;
}

interface SLAPerformance {
  totalSLAs: number;
  totalBreaches: number;
  breachPercentage: number;
  firstResponseBreaches: number;
  resolutionBreaches: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface ReportState {
  ticketStatistics: TicketStatistics | null;
  ticketDistribution: TicketDistribution | null;
  ticketTrends: TicketTrends | null;
  teamPerformance: TeamPerformance[];
  slaPerformance: SLAPerformance | null;

  dashboard: DashboardData | null;
  isLoadingDashboard: boolean;

  isLoadingStatistics: boolean;
  isLoadingDistribution: boolean;
  isLoadingTeamPerformance: boolean;
  isLoadingTrends: boolean;
  isLoadingSLA: boolean;

  error: string | null;
  dashboardError: string | null;
}

export interface DashboardMetrics {
  totalTickets: number;
  openTickets: number;
  awaitingReply: number;
  resolvedTickets: number;
  escalatedTickets: number;
}

export interface DashboardTicket {
  id: string;
  ticketNumber: number;
  title: string;
  status: string;
  priority?: string;
  updatedAt: string;
}

export interface DashboardActivity {
  id: string;
  action: string;
  createdAt: string;
  ticket: {
    id: string;
    ticketNumber: number;
    title: string;
  };
}

export interface DashboardData {
  metrics: DashboardMetrics;
  recentTickets: DashboardTicket[];
  needsAttention: DashboardTicket[];
  recentNotifications: DashboardActivity[];
}

interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}

const initialState: ReportState = {
  ticketStatistics: null,
  ticketDistribution: null,
  teamPerformance: [],
  ticketTrends: null,
  slaPerformance: null,

  dashboard: null,

  isLoadingDashboard: false,
  isLoadingStatistics: false,
  isLoadingDistribution: false,
  isLoadingTeamPerformance: false,
  isLoadingTrends: false,
  isLoadingSLA: false,

  error: null,
  dashboardError: null,
};

export const fetchTicketStatistics = createAsyncThunk<
  TicketStatistics,
  void,
  { rejectValue: string }
>("report/fetchTicketStatistics", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/report/ticket_statistics`, {
      method: "GET",
      credentials: "include",
    });

    const result: ApiResponse<TicketStatistics> = await response.json();

    if (!response.ok) {
      return rejectWithValue(
        result.message || "Failed to fetch ticket statistics.",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Fetch ticket statistics error:", error);

    return rejectWithValue("Unable to fetch ticket statistics.");
  }
});

export const fetchTicketDistribution = createAsyncThunk<
  TicketDistribution,
  void,
  { rejectValue: string }
>("report/fetchTicketDistribution", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/report/ticket_distribution`, {
      method: "GET",
      credentials: "include",
    });

    const result: ApiResponse<TicketDistribution> = await response.json();

    if (!response.ok) {
      return rejectWithValue(
        result.message || "Failed to fetch ticket distribution.",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Fetch ticket distribution error:", error);

    return rejectWithValue("Unable to fetch ticket distribution.");
  }
});

export const fetchTeamPerformance = createAsyncThunk<
  TeamPerformance[],
  void,
  { rejectValue: string }
>("report/fetchTeamPerformance", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/report/team_performace`, {
      method: "GET",
      credentials: "include",
    });

    const result: ApiResponse<TeamPerformance[]> = await response.json();

    if (!response.ok) {
      return rejectWithValue(
        result.message || "Failed to fetch team performance.",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Fetch team performance error:", error);

    return rejectWithValue("Unable to fetch team performance.");
  }
});

export const fetchTicketTrends = createAsyncThunk<
  TicketTrends,
  void,
  { rejectValue: string }
>("report/fetchTicketTrends", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/report/ticket_trends`, {
      method: "GET",
      credentials: "include",
    });

    const result: ApiResponse<TicketTrends> = await response.json();

    if (!response.ok) {
      return rejectWithValue(
        result.message || "Failed to fetch ticket trends.",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Fetch ticket trends error:", error);

    return rejectWithValue("Unable to fetch ticket trends.");
  }
});

export const fetchSLAPerformance = createAsyncThunk<
  SLAPerformance,
  void,
  { rejectValue: string }
>("report/fetchSLAPerformance", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/report/sla_performance`, {
      method: "GET",
      credentials: "include",
    });

    const result: ApiResponse<SLAPerformance> = await response.json();

    if (!response.ok) {
      return rejectWithValue(
        result.message || "Failed to fetch SLA performance.",
      );
    }

    return result.data;
  } catch (error) {
    console.error("Fetch SLA performance error:", error);

    return rejectWithValue("Unable to fetch SLA performance.");
  }
});

export const fetchDashboard = createAsyncThunk<
  DashboardResponse,
  void,
  { rejectValue: string }
>("report/fetchDashboard", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/report/dashboard`, {
      method: "GET",
      credentials: "include",
    });

    const data: DashboardResponse = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || "Failed to fetch dashboard data.");
    }

    return data;
  } catch (error) {
    console.error("Fetch dashboard error:", error);

    return rejectWithValue("Unable to fetch dashboard data. Please try again.");
  }
});

const reportSlice = createSlice({
  name: "report",

  initialState,

  reducers: {
    clearReportError: (state) => {
      state.error = null;
    },

    clearReports: (state) => {
      state.ticketStatistics = null;
      state.ticketDistribution = null;
      state.teamPerformance = [];
      state.ticketTrends = null;
      state.slaPerformance = null;
      state.dashboard = null;
      state.dashboardError = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTicketStatistics.pending, (state) => {
        state.isLoadingStatistics = true;
        state.error = null;
      })
      .addCase(fetchTicketStatistics.fulfilled, (state, action) => {
        state.isLoadingStatistics = false;
        state.ticketStatistics = action.payload;
      })
      .addCase(fetchTicketStatistics.rejected, (state, action) => {
        state.isLoadingStatistics = false;
        state.error = action.payload || "Failed to fetch ticket statistics.";
      });

    builder
      .addCase(fetchTicketDistribution.pending, (state) => {
        state.isLoadingDistribution = true;
        state.error = null;
      })
      .addCase(fetchTicketDistribution.fulfilled, (state, action) => {
        state.isLoadingDistribution = false;
        state.ticketDistribution = action.payload;
      })
      .addCase(fetchTicketDistribution.rejected, (state, action) => {
        state.isLoadingDistribution = false;
        state.error = action.payload || "Failed to fetch ticket distribution.";
      });

    builder
      .addCase(fetchTeamPerformance.pending, (state) => {
        state.isLoadingTeamPerformance = true;
        state.error = null;
      })
      .addCase(fetchTeamPerformance.fulfilled, (state, action) => {
        state.isLoadingTeamPerformance = false;
        state.teamPerformance = action.payload;
      })
      .addCase(fetchTeamPerformance.rejected, (state, action) => {
        state.isLoadingTeamPerformance = false;
        state.error = action.payload || "Failed to fetch team performance.";
      });

    builder
      .addCase(fetchTicketTrends.pending, (state) => {
        state.isLoadingTrends = true;
        state.error = null;
      })
      .addCase(fetchTicketTrends.fulfilled, (state, action) => {
        state.isLoadingTrends = false;
        state.ticketTrends = action.payload;
      })
      .addCase(fetchTicketTrends.rejected, (state, action) => {
        state.isLoadingTrends = false;
        state.error = action.payload || "Failed to fetch ticket trends.";
      });

    builder
      .addCase(fetchSLAPerformance.pending, (state) => {
        state.isLoadingSLA = true;
        state.error = null;
      })
      .addCase(fetchSLAPerformance.fulfilled, (state, action) => {
        state.isLoadingSLA = false;
        state.slaPerformance = action.payload;
      })
      .addCase(fetchSLAPerformance.rejected, (state, action) => {
        state.isLoadingSLA = false;
        state.error = action.payload || "Failed to fetch SLA performance.";
      });
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.isLoadingDashboard = true;
        state.dashboardError = null;
      })

      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.isLoadingDashboard = false;
        state.dashboard = action.payload.data;
        state.dashboardError = null;
      })

      .addCase(fetchDashboard.rejected, (state, action) => {
        state.isLoadingDashboard = false;
        state.dashboardError =
          action.payload || "Failed to fetch dashboard data.";
      });
  },
});

export const { clearReportError, clearReports } = reportSlice.actions;

export default reportSlice.reducer;

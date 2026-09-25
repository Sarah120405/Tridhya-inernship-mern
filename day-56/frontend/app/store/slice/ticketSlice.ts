import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const API_URL = "http://localhost:5000/api";

interface TicketPerson {
  id: string;
  name: string;
  email: string;
}

export interface Ticket {
  id: string;
  ticketNumber: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  customerId: string;
  assignedAgentId?: string | null;
  assignedDeveloperId?: string | null;
  attachments?: unknown[] | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string | null;
  closedAt?: string | null;

  customer?: TicketPerson | null;
  assignedAgent?: TicketPerson | null;
  assignedDeveloper?: TicketPerson | null;
}

interface TicketState {
  tickets: Ticket[];
  isLoading: boolean;
  fetchError: string | null;

  ticketDetails: Ticket | null;
  isDetailsLoading: boolean;
  detailsError: string | null;

  isCreating: boolean;
  createError: string | null;
  createdTicketId: string | null;

  isUpdatingStatus: boolean;
  statusUpdateError: string | null;
}

export interface CreateTicketResponse {
  success: boolean;
  message: string;
  data?: {
    ticket?: {
      id: string;
    };
  };
}

interface FetchTicketsResponse {
  data?: Ticket[];
  tickets?: Ticket[];
  message?: string;
}

interface FetchTicketDetailsResponse {
  data?: Ticket;
  ticket?: Ticket;
  message?: string;
}

interface CloseTicketPayload {
  ticketId: string;
  action: "CLOSE" | "REOPEN";
}

const initialState: TicketState = {
  tickets: [],
  isLoading: false,
  fetchError: null,

  ticketDetails: null,
  isDetailsLoading: false,
  detailsError: null,

  isCreating: false,
  createError: null,
  createdTicketId: null,

  isUpdatingStatus: false,
  statusUpdateError: null,
};

export const createTicket = createAsyncThunk<
  string,
  FormData,
  { rejectValue: string }
>("tickets/create", async (ticketData, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API_URL}/tickets/`, {
      method: "POST",
      credentials: "include",
      body: ticketData,
    });
    const result: CreateTicketResponse = await res.json();

    if (!res.ok) {
      return rejectWithValue(result.message || "Unable to create ticket.");
    }

    const ticketId = result.data?.ticket?.id;

    if (!ticketId) {
      return rejectWithValue("Ticket created, but no ticket ID was returned.");
    }

    return ticketId;
  } catch {
    return rejectWithValue("Network error. Please try again.");
  }
});

export const fetchTickets = createAsyncThunk<
  Ticket[],
  void,
  { rejectValue: string }
>("tickets/", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API_URL}/tickets/`, {
      credentials: "include",
    });
    const result: FetchTicketsResponse | Ticket[] = await res.json();

    if (!res.ok) {
      const message =
        !Array.isArray(result) && result.message
          ? result.message
          : "Unable to fetch tickets.";

      return rejectWithValue(message);
    }

    const tickets = Array.isArray(result)
      ? result
      : (result.data ?? result.tickets);

    if (!Array.isArray(tickets)) {
      return rejectWithValue("Unexpected tickets response format.");
    }

    return tickets;
  } catch (error) {
    return rejectWithValue("Network error. Please try again.");
  }
});

export const fetchTicketDetails = createAsyncThunk<
  Ticket,
  string,
  { rejectValue: string }
>("tickets/fetchDetails", async (ticketId, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API_URL}/tickets/${ticketId}`, {
      credentials: "include",
    });
    const result: FetchTicketDetailsResponse = await res.json();

    if (!res.ok) {
      const message =
        result && result.message ? result.message : "Unable to fetch ticket.";
      return rejectWithValue(message);
    }

    const ticket = result.data ?? result.ticket;

    if (!ticket || typeof ticket !== "object") {
      return rejectWithValue("Unexpected ticket response format.");
    }

    return ticket;
  } catch (error) {
    return rejectWithValue("Network error. Please try again.");
  }
});

export const developerUpdateTicket = createAsyncThunk(
  "ticket/developer_update",
  async (ticketId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/tickets/developer_update/${ticketId}`,
        {
          method: "PATCH",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to update ticket.");
      }

      return data.data.updateTicket;
    } catch (error) {
      return rejectWithValue("Something went wrong.");
    }
  },
);

export const resolveTicket = createAsyncThunk(
  "ticket/resolve_ticket",
  async (ticketId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/tickets/ticket_resolved/${ticketId}`,
        {
          method: "PATCH",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to resolve ticket.");
      }

      return data.data.updatedTicket;
    } catch (error) {
      return rejectWithValue("Something went wrong.");
    }
  },
);

export const closeTicket = createAsyncThunk<
  Ticket,
  CloseTicketPayload,
  { rejectValue: string }
>("ticket/close_update", async ({ ticketId, action }, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `${API_URL}/tickets/ticket_close/${ticketId}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || "Failed to update ticket.");
    }

    return data.data.updatedTicket;
  } catch {
    return rejectWithValue("Something went wrong.");
  }
});

const ticketSlice = createSlice({
  name: "ticketSlice",
  initialState,
  reducers: {
    resetCreatedTicket: (state) => {
      state.createdTicketId = null;
      state.createError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTicket.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
        state.createdTicketId = null;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.isCreating = false;
        state.createdTicketId = action.payload;
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.isCreating = false;
        state.createError =
          action.payload || action.error.message || "Ticket creation failed.";
      })
      .addCase(fetchTickets.pending, (state) => {
        state.isLoading = true;
        state.fetchError = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.fetchError =
          action.payload || action.error.message || "Failed to fetch tickets.";
      })
      .addCase(fetchTicketDetails.pending, (state) => {
        state.isDetailsLoading = true;
        state.detailsError = null;
        state.ticketDetails = null;
      })
      .addCase(fetchTicketDetails.fulfilled, (state, action) => {
        state.isDetailsLoading = false;
        state.ticketDetails = action.payload;
      })
      .addCase(fetchTicketDetails.rejected, (state, action) => {
        state.isDetailsLoading = false;
        state.detailsError =
          action.payload ||
          action.error.message ||
          "Failed to fetch ticket details.";
      })
      .addCase(developerUpdateTicket.pending, (state) => {
        state.isUpdatingStatus = true;
        state.statusUpdateError = null;
      })

      .addCase(developerUpdateTicket.fulfilled, (state, action) => {
        state.isUpdatingStatus = false;
        state.statusUpdateError = null;

        const updatedTicket = action.payload;

        state.ticketDetails = updatedTicket;

        const index = state.tickets.findIndex(
          (ticket) => ticket.id === updatedTicket.id,
        );

        if (index !== -1) {
          state.tickets[index] = updatedTicket;
        }
      })

      .addCase(developerUpdateTicket.rejected, (state, action) => {
        state.isUpdatingStatus = false;
        state.statusUpdateError =
          (action.payload as string) || "Failed to update ticket.";
      })

      .addCase(resolveTicket.pending, (state) => {
        state.isUpdatingStatus = true;
        state.statusUpdateError = null;
      })

      .addCase(resolveTicket.fulfilled, (state, action) => {
        state.isUpdatingStatus = false;
        state.statusUpdateError = null;

        const updatedTicket = action.payload;

        state.ticketDetails = updatedTicket;

        const index = state.tickets.findIndex(
          (ticket) => ticket.id === updatedTicket.id,
        );

        if (index !== -1) {
          state.tickets[index] = updatedTicket;
        }
      })

      .addCase(resolveTicket.rejected, (state, action) => {
        state.isUpdatingStatus = false;
        state.statusUpdateError =
          (action.payload as string) || "Failed to resolve ticket.";
      });

    builder
      .addCase(closeTicket.pending, (state) => {
        state.isUpdatingStatus = true;
        state.statusUpdateError = null;
      })

      .addCase(closeTicket.fulfilled, (state, action) => {
        state.isUpdatingStatus = false;
        state.statusUpdateError = null;

        const updatedTicket = action.payload;

        state.ticketDetails = updatedTicket;

        const index = state.tickets.findIndex(
          (ticket) => ticket.id === updatedTicket.id,
        );

        if (index !== -1) {
          state.tickets[index] = updatedTicket;
        }
      })

      .addCase(closeTicket.rejected, (state, action) => {
        state.isUpdatingStatus = false;
        state.statusUpdateError = action.payload || "Failed to update ticket.";
      });
  },
});

export const { resetCreatedTicket } = ticketSlice.actions;
export default ticketSlice.reducer;

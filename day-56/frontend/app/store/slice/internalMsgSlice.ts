import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
const API_URL = "http://localhost:5000/api";

export interface InternalMsg {
  id: string;
  ticketId: string;
  senderId: string;
  content: string;
  isAIGenerated: boolean;
  createdAt: string;
  updatedAt: string;
  sender: {
    id: string;
    name: string;
    email: string;
    role: "SupportAgent" | "Developer" | "Admin";
  };
}
type CreateInternalMsgPayload = {
  ticketId: string;
  content: string;
};

type CreateInternalMsgResponse = {
  success: boolean;
  message: string;
  data: InternalMsg;
};
interface FetchInternalMsgResponse {
  success: boolean;
  message: string;
  data: InternalMsg[];
}
interface ApiError {
  message?: string;
}
interface InternalMsgState {
  messages: InternalMsg[];
  isLoading: boolean;
  fetchError: string | null;

  isSending: boolean;
  sendError: string | null;
}

export const fetchTicketInternalMsg = createAsyncThunk<
  InternalMsg[],
  string,
  { rejectValue: string }
>(
  "internalMsg/FetchInternalMsgResponse",
  async (ticketId, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${API_URL}/internal_messages/tickets/${ticketId}`,
        {
          credentials: "include",
        },
      );
      const result: FetchInternalMsgResponse | ApiError = await res.json();

      if (!res.ok) {
        return rejectWithValue(
          "message" in result && typeof result.message === "string"
            ? result.message
            : "Unable to fetch internal messages.",
        );
      }

      if (!("data" in result) || !Array.isArray(result.data)) {
        return rejectWithValue("Unexpected messages response format.");
      }

      return result.data;
    } catch (error) {
      return rejectWithValue("Network error. Please try again.");
    }
  },
);

export const createTicketInternalMsg = createAsyncThunk<
  InternalMsg,
  CreateInternalMsgPayload,
  { rejectValue: string }
>(
  "internalMsg/createInternalMsg",
  async ({ ticketId, content }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${API_URL}/internal_messages/tickets/${ticketId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        },
      );
      const result: CreateInternalMsgResponse | ApiError = await res.json();

      if (!res.ok) {
        return rejectWithValue(
          "message" in result && typeof result.message === "string"
            ? result.message
            : "Unable to create messages.",
        );
      }

      if (!("data" in result) || !result.data) {
        return rejectWithValue("Unexpected create message response format.");
      }

      return result.data;
    } catch (error) {
      return rejectWithValue("Network error. Please try again.");
    }
  },
);

const initialState: InternalMsgState = {
  messages: [],
  isLoading: false,
  fetchError: null,

  isSending: false,
  sendError: null,
};

function addInternalMsgIfNotExists(
  messages: InternalMsg[],
  message: InternalMsg,
) {
  const alreadyExists = messages.some(
    (existingMsg) => existingMsg.id === message.id,
  );

  if (!alreadyExists) {
    messages.push(message);
  }
}

const InternalMsgSlice = createSlice({
  name: "internalMsgSlice",
  initialState,
  reducers: {
    addInternalMsg: (state, action: PayloadAction<InternalMsg>) => {
      addInternalMsgIfNotExists(state.messages, action.payload);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTicketInternalMsg.pending, (state) => {
        state.isLoading = true;
        state.fetchError = null;
      })
      .addCase(fetchTicketInternalMsg.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchTicketInternalMsg.rejected, (state, action) => {
        state.fetchError =
          action.payload || action.error.message || "Message fetching failed.";
        state.isLoading = false;
      })
      .addCase(createTicketInternalMsg.pending, (state) => {
        state.isSending = true;
        state.sendError = null;
      })

      .addCase(createTicketInternalMsg.fulfilled, (state, action) => {
        addInternalMsgIfNotExists(state.messages, action.payload);

        state.isSending = false;
        state.sendError = null;
      })

      .addCase(createTicketInternalMsg.rejected, (state, action) => {
        state.isSending = false;
        state.sendError =
          action.payload ?? "Unable to send InternalMsg. Please try again.";
      });
  },
});

export const { addInternalMsg } = InternalMsgSlice.actions;
export default InternalMsgSlice.reducer;

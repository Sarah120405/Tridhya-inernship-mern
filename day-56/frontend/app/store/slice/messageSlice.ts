import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const API_URL = "http://localhost:5000/api";

interface Message {
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
    role: "Customer" | "SupportAgent" | "Developer" | "Admin";
  };
}
type AgentAssistance = {
  suggestedResponse: string;
  escalationRecommended: boolean;
  escalationReason: string | null;
  confidence: number;
};
type CreateMessagePayload = {
  ticketId: string;
  content?: string;
  aiSuggestionUsed?: boolean;
  aiSuggestion?: AgentAssistance;
};

type CreateMessageResponse = {
  success: boolean;
  message: string;
  data: Message;
};
interface FetchMessage {
  success: boolean;
  message: string;
  data: Message[];
}
interface ApiError {
  message?: string;
}
interface MessageState {
  messages: Message[];
  isLoading: boolean;
  fetchError: string | null;

  isSending: boolean;
  sendError: string | null;
}

export const fetchTicketMessage = createAsyncThunk<
  Message[],
  string,
  { rejectValue: string }
>("message/fetchMessage", async (ticketId, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API_URL}/messages/tickets/${ticketId}`, {
      credentials: "include",
    });
    const result: FetchMessage | ApiError = await res.json();

    if (!res.ok) {
      return rejectWithValue(
        "message" in result && typeof result.message === "string"
          ? result.message
          : "Unable to fetch messages.",
      );
    }

    if (!("data" in result) || !Array.isArray(result.data)) {
      return rejectWithValue("Unexpected messages response format.");
    }

    return result.data;
  } catch (error) {
    return rejectWithValue("Network error. Please try again.");
  }
});

export const createTicketMessage = createAsyncThunk<
  Message,
  CreateMessagePayload,
  { rejectValue: string }
>(
  "message/createMessage",
  async (
    { ticketId, content, aiSuggestionUsed = false, aiSuggestion },
    { rejectWithValue },
  ) => {
    try {
      const res = await fetch(`${API_URL}/messages/tickets/${ticketId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, aiSuggestionUsed, aiSuggestion }),
      });
      const result: CreateMessageResponse | ApiError = await res.json();

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

const initialState: MessageState = {
  messages: [],
  isLoading: false,
  fetchError: null,

  isSending: false,
  sendError: null,
};
const messageSlice = createSlice({
  name: "messageSlice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchTicketMessage.pending, (state) => {
        state.isLoading = true;
        state.fetchError = null;
      })
      .addCase(fetchTicketMessage.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchTicketMessage.rejected, (state, action) => {
        state.fetchError =
          action.payload || action.error.message || "Message fetching failed.";
        state.isLoading = false;
      })
      .addCase(createTicketMessage.pending, (state) => {
        state.isSending = true;
        state.sendError = null;
      })

      .addCase(createTicketMessage.fulfilled, (state, action) => {
        state.isSending = false;
        state.messages.push(action.payload);
      })

      .addCase(createTicketMessage.rejected, (state, action) => {
        state.isSending = false;
        state.sendError =
          action.payload ?? "Unable to send message. Please try again.";
      });
  },
});

export default messageSlice.reducer;

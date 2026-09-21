import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL = "http://localhost:5000/api";

interface AiSuggestion {
  suggestedCategory: string;
  suggestedPriority: string;
  confidence: number;
  reasoning: string;
}

interface AgentAssistance {
  suggestedResponse: string;
  escalationRecommended: boolean;
  escalationReason: string | null;
  confidence: number;
}

interface AiState {
  suggestion: AiSuggestion | null;
  agentAssistance: AgentAssistance | null;

  isLoading: boolean;
  isAgentAssistanceLoading: boolean;

  error: string | null;
  agentAssistanceError: string | null;

  suggestionUsed: boolean;
}

const initialState: AiState = {
  suggestion: null,
  agentAssistance: null,

  isLoading: false,
  isAgentAssistanceLoading: false,

  error: null,
  agentAssistanceError: null,

  suggestionUsed: false,
};

interface TicketSuggestionInput {
  title: string;
  description: string;
  customerCategory: string;
}

export const ticketSuggestion = createAsyncThunk<
  AiSuggestion,
  TicketSuggestionInput,
  { rejectValue: string }
>(
  "ai/analyze-ticket",
  async ({ title, description, customerCategory }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/ai/analyze-ticket`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, customerCategory }),
      });

      const res = await response.json();

      if (!response.ok) {
        return rejectWithValue(res.message || "Unable to get AI suggestions.");
      }

      return res.data ?? res;
    } catch {
      return rejectWithValue("Network error. Please try again.");
    }
  },
);

export const agentAssistance = createAsyncThunk<
  AgentAssistance,
  string,
  { rejectValue: string }
>("ai/agent_assistance", async (ticketId, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/ai/agent_assistance/${ticketId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();

    if (!response.ok) {
      return rejectWithValue(res.message || "Unable to get AI assistance.");
    }

    return res.data as AgentAssistance;
  } catch {
    return rejectWithValue("Network error. Please try again.");
  }
});

const aiSlice = createSlice({
  name: "aiSlice",
  initialState,
  reducers: {
    clearAiSuggestion: (state) => {
      state.suggestion = null;
      state.suggestionUsed = false;
      state.error = null;
    },

    markSuggestionUsed: (state) => {
      if (state.suggestion) {
        state.suggestionUsed = true;
      }
    },

    resetSuggestionUsed: (state) => {
      state.suggestionUsed = false;
    },
    clearAgentAssistance: (state) => {
      state.agentAssistance = null;
      state.agentAssistanceError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(ticketSuggestion.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.suggestion = null;
        state.suggestionUsed = false;
      })
      .addCase(ticketSuggestion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.suggestion = action.payload;
        state.suggestionUsed = false;
      })
      .addCase(ticketSuggestion.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload || action.error.message || "AI suggestion failed.";
      })
      .addCase(agentAssistance.pending, (state) => {
        state.isAgentAssistanceLoading = true;
        state.agentAssistanceError = null;
        state.agentAssistance = null;
      })

      .addCase(agentAssistance.fulfilled, (state, action) => {
        state.isAgentAssistanceLoading = false;
        state.agentAssistance = action.payload;
      })

      .addCase(agentAssistance.rejected, (state, action) => {
        state.isAgentAssistanceLoading = false;
        state.agentAssistanceError =
          action.payload ?? "Unable to get AI assistance.";
      });
  },
});

export const {
  clearAiSuggestion,
  markSuggestionUsed,
  resetSuggestionUsed,
  clearAgentAssistance,
} = aiSlice.actions;
export default aiSlice.reducer;

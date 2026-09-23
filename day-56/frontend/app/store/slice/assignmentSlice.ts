import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Ticket } from "./ticketSlice";
import { User } from "./authSlice";
import { AgentAssistance } from "./aiSlice";

const API_URL = "http://localhost:5000/api";

interface AssignDeveloperPayload {
  ticketId: string;
  developerId: string;
  aiSuggestion: AgentAssistance | null;
}
interface AssignDeveloperResponse {
  success: boolean;
  message: string;
  data: {
    developer: User;
    updatedTicket: Ticket;
    updatedTicketActivity: TicketActivity;
  };
}

interface AssignAgentPayload {
  ticketId: string;
  agentId: string;
}

interface AssignAgentResponse {
  success: boolean;
  message: string;
  data: {
    agent: User;
    updatedTicket: Ticket;
    updatedTicketActivity: TicketActivity;
  };
}

interface TicketActivity {
  id: string;
  ticketId: string;
  userId: string;
  action: string;
}

interface AssignmentState {
  isAssigningDeveloper: boolean;
  assignmentError: string | null;

  isAssigningAgent: boolean;
  agentAssignmentError: string | null;
}

const initialState: AssignmentState = {
  isAssigningDeveloper: false,
  assignmentError: null,

  isAssigningAgent: false,
  agentAssignmentError: null,
};

export const assignDeveloper = createAsyncThunk<
  AssignDeveloperResponse,
  AssignDeveloperPayload,
  { rejectValue: string }
>(
  "assignment/assignDeveloper",
  async ({ ticketId, developerId, aiSuggestion }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/ticket_assigned/developer/${ticketId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            developerId,
            aiSuggestion,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to assign developer.");
      }

      return data as AssignDeveloperResponse;
    } catch (error) {
      return rejectWithValue("Failed to assign developer.");
    }
  },
);

export const assignAgent = createAsyncThunk<
  AssignAgentResponse,
  AssignAgentPayload,
  { rejectValue: string }
>(
  "assignment/assignAgent",
  async ({ ticketId, agentId }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/ticket_assigned/agent/${ticketId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            agentId,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message || "Failed to assign support agent.",
        );
      }

      return data as AssignAgentResponse;
    } catch (error) {
      return rejectWithValue("Failed to assign support agent.");
    }
  },
);

const assignmentSlice = createSlice({
  name: "assignmentSlice",

  initialState,

  reducers: {
    clearAssignmentErrors: (state) => {
      state.assignmentError = null;
      state.agentAssignmentError = null;
    },
  },

  extraReducers(builder) {
    builder
      .addCase(assignDeveloper.pending, (state) => {
        state.isAssigningDeveloper = true;
        state.assignmentError = null;
      })

      .addCase(assignDeveloper.fulfilled, (state) => {
        state.isAssigningDeveloper = false;
        state.assignmentError = null;
      })

      .addCase(assignDeveloper.rejected, (state, action) => {
        state.isAssigningDeveloper = false;

        state.assignmentError = action.payload || "Failed to assign developer.";
      });

    builder
      .addCase(assignAgent.pending, (state) => {
        state.isAssigningAgent = true;
        state.agentAssignmentError = null;
      })

      .addCase(assignAgent.fulfilled, (state) => {
        state.isAssigningAgent = false;
        state.agentAssignmentError = null;
      })

      .addCase(assignAgent.rejected, (state, action) => {
        state.isAssigningAgent = false;

        state.agentAssignmentError =
          action.payload || "Failed to assign support agent.";
      });
  },
});

export const { clearAssignmentErrors } = assignmentSlice.actions;

export default assignmentSlice.reducer;

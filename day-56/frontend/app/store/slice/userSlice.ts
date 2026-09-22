import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL = "http://localhost:5000/api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "Customer" | "SupportAgent" | "Developer" | "Admin";
  isActive: boolean;
}

interface UserResponse {
  success: boolean;
  message: string;
  data: User[];
}

interface UserState {
  customers: User[];
  developers: User[];
  supportAgents: User[];

  isLoadingCustomers: boolean;
  isLoadingDevelopers: boolean;
  isLoadingSupportAgents: boolean;

  customersError: string | null;
  developersError: string | null;
  supportAgentsError: string | null;
}

const initialState: UserState = {
  customers: [],
  developers: [],
  supportAgents: [],

  isLoadingCustomers: false,
  isLoadingDevelopers: false,
  isLoadingSupportAgents: false,

  customersError: null,
  developersError: null,
  supportAgentsError: null,
};

export const getCustomers = createAsyncThunk<
  UserResponse,
  void,
  { rejectValue: string }
>("user/getCustomers", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/users/customer`, {
      method: "GET",
      credentials: "include",
    });

    const data: UserResponse = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || "Failed to fetch customers.");
    }

    return data;
  } catch (error) {
    return rejectWithValue("Failed to fetch customers.");
  }
});

export const getDevelopers = createAsyncThunk<
  UserResponse,
  void,
  { rejectValue: string }
>("user/getDevelopers", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/user/developers`, {
      method: "GET",
      credentials: "include",
    });

    const data: UserResponse = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || "Failed to fetch developers.");
    }

    return data;
  } catch (error) {
    return rejectWithValue("Failed to fetch developers.");
  }
});

export const getSupportAgents = createAsyncThunk<
  UserResponse,
  void,
  { rejectValue: string }
>("user/getSupportAgents", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/user/support_agents`, {
      method: "GET",
      credentials: "include",
    });

    const data: UserResponse = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || "Failed to fetch support agents.");
    }

    return data;
  } catch (error) {
    return rejectWithValue("Failed to fetch support agents.");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserErrors: (state) => {
      state.customersError = null;
      state.developersError = null;
      state.supportAgentsError = null;
    },

    clearUsers: (state) => {
      state.customers = [];
      state.developers = [];
      state.supportAgents = [];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getCustomers.pending, (state) => {
        state.isLoadingCustomers = true;
        state.customersError = null;
      })

      .addCase(getCustomers.fulfilled, (state, action) => {
        state.isLoadingCustomers = false;
        state.customers = action.payload.data;
      })

      .addCase(getCustomers.rejected, (state, action) => {
        state.isLoadingCustomers = false;
        state.customersError = action.payload || "Failed to fetch customers.";
      });

    builder
      .addCase(getDevelopers.pending, (state) => {
        state.isLoadingDevelopers = true;
        state.developersError = null;
      })

      .addCase(getDevelopers.fulfilled, (state, action) => {
        state.isLoadingDevelopers = false;
        state.developers = action.payload.data;
      })

      .addCase(getDevelopers.rejected, (state, action) => {
        state.isLoadingDevelopers = false;
        state.developersError = action.payload || "Failed to fetch developers.";
      });

    builder
      .addCase(getSupportAgents.pending, (state) => {
        state.isLoadingSupportAgents = true;
        state.supportAgentsError = null;
      })

      .addCase(getSupportAgents.fulfilled, (state, action) => {
        state.isLoadingSupportAgents = false;
        state.supportAgents = action.payload.data;
      })

      .addCase(getSupportAgents.rejected, (state, action) => {
        state.isLoadingSupportAgents = false;
        state.supportAgentsError =
          action.payload || "Failed to fetch support agents.";
      });
  },
});

export const { clearUserErrors, clearUsers } = userSlice.actions;

export default userSlice.reducer;

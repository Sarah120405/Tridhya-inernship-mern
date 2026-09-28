import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { User } from "./authSlice";
const API_URL = "http://localhost:5000/api";

interface UserResponse {
  success: boolean;
  message: string;
  data: User[];
}

interface UpdateUserDetailsPayload {
  name?: string;
  email?: string;
}

interface UpdateUserPasswordPayload {
  currentPassword: string;
  newPassword: string;
}

interface UserState {
  customers: User[];
  developers: User[];
  supportAgents: User[];
  allUsers: User[];

  isLoadingCustomers: boolean;
  isLoadingDevelopers: boolean;
  isLoadingSupportAgents: boolean;
  isLoadingAllUsers: boolean;

  totalUsers: number;
  currentPage: number;
  totalPages: number;

  customersError: string | null;
  developersError: string | null;
  supportAgentsError: string | null;
  allUsersError: string | null;

  isUpdatingUser: boolean;
  updateUserError: string | null;

  isUpdatingPassword: boolean;
  updatePasswordError: string | null;

  isUpdatingRole: boolean;
  updateRoleError: string | null;
}

const initialState: UserState = {
  customers: [],
  developers: [],
  supportAgents: [],
  allUsers: [],

  isLoadingCustomers: false,
  isLoadingDevelopers: false,
  isLoadingSupportAgents: false,
  isLoadingAllUsers: false,
  isUpdatingUser: false,
  isUpdatingPassword: false,
  isUpdatingRole: false,

  customersError: null,
  developersError: null,
  supportAgentsError: null,
  allUsersError: null,
  updateUserError: null,
  updatePasswordError: null,
  updateRoleError: null,

  totalUsers: 0,
  currentPage: 1,
  totalPages: 0,
};

export const getAllUsers = createAsyncThunk<
  {
    users: User[];
    totalUsers: number;
    page: number;
    limit: number;
    totalPages: number;
  },
  {
    page: number;
    limit: number;
    filter: string;
    search: string;
  },
  { rejectValue: string }
>(
  "user/getAllUsers",
  async ({ page, limit, filter, search }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        filter,
        search,
      });

      const response = await fetch(`${API_URL}/user?${params.toString()}`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to fetch users.");
      }

      return data.data;
    } catch {
      return rejectWithValue("Something went wrong while fetching users.");
    }
  },
);

export const getCustomers = createAsyncThunk<
  UserResponse,
  void,
  { rejectValue: string }
>("user/getCustomers", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/user/customer`, {
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

export const updateUserDetails = createAsyncThunk<
  User,
  UpdateUserDetailsPayload,
  { rejectValue: string }
>("user/updateUserDetails", async (userData, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/user/update_user`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || "Failed to update user details.");
    }

    return data.data;
  } catch {
    return rejectWithValue("Something went wrong while updating user details.");
  }
});

export const updateUserPassword = createAsyncThunk<
  { message: string },
  UpdateUserPasswordPayload,
  { rejectValue: string }
>(
  "user/updateUserPassword",
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/user/update_password`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to update password.");
      }

      return {
        message: data.message || "Password updated successfully.",
      };
    } catch {
      return rejectWithValue(
        "Something went wrong while updating your password.",
      );
    }
  },
);

export const updateUserRole = createAsyncThunk<
  User,
  {
    userId: string;
    role: "Customer" | "SupportAgent" | "Developer";
  },
  { rejectValue: string }
>("user/updateUserRole", async ({ userId, role }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/user/update_role/${userId}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || "Failed to update user role.");
    }

    return data.data;
  } catch {
    return rejectWithValue(
      "Something went wrong while updating the user role.",
    );
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
      state.allUsersError = null;
      state.updateUserError = null;
      state.updatePasswordError = null;
      state.updateRoleError = null;
    },

    clearUsers: (state) => {
      state.customers = [];
      state.developers = [];
      state.supportAgents = [];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.isLoadingAllUsers = true;
        state.allUsersError = null;
      })

      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoadingAllUsers = false;
        state.allUsersError = null;

        state.allUsers = action.payload.users;
        state.totalUsers = action.payload.totalUsers;
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })

      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoadingAllUsers = false;

        state.allUsersError = action.payload || "Failed to fetch users.";
      });
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

    builder
      .addCase(updateUserDetails.pending, (state) => {
        state.isUpdatingUser = true;
        state.updateUserError = null;
      })

      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.isUpdatingUser = false;
        state.updateUserError = null;
      })

      .addCase(updateUserDetails.rejected, (state, action) => {
        state.isUpdatingUser = false;
        state.updateUserError =
          action.payload || "Failed to update user details.";
      })

      .addCase(updateUserPassword.pending, (state) => {
        state.isUpdatingPassword = true;
        state.updatePasswordError = null;
      })

      .addCase(updateUserPassword.fulfilled, (state) => {
        state.isUpdatingPassword = false;
        state.updatePasswordError = null;
      })

      .addCase(updateUserPassword.rejected, (state, action) => {
        state.isUpdatingPassword = false;
        state.updatePasswordError =
          action.payload || "Failed to update password.";
      })
      .addCase(updateUserRole.pending, (state) => {
        state.isUpdatingRole = true;
        state.updateRoleError = null;
      })

      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.isUpdatingRole = false;
        state.updateRoleError = null;

        const index = state.allUsers.findIndex(
          (user) => user.id === action.payload.id,
        );

        if (index !== -1) {
          state.allUsers[index] = action.payload;
        }
      })

      .addCase(updateUserRole.rejected, (state, action) => {
        state.isUpdatingRole = false;
        state.updateRoleError = action.payload || "Failed to update user role.";
      });
  },
});

export const { clearUserErrors, clearUsers } = userSlice.actions;

export default userSlice.reducer;

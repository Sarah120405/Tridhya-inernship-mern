import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL = "http://localhost:5000/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: "Customer" | "SupportAgent" | "Developer" | "Admin";
}

interface AuthState {
  message: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

const initialState: AuthState = {
  message: null,
  user: null,
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk<
  any,
  RegisterData,
  { rejectValue: string }
>("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (!res.ok) {
      return rejectWithValue(data.error || "Failed to register user");
    }

    return data;
  } catch {
    return rejectWithValue("Unable to connect to the server");
  }
});

export const login = createAsyncThunk<any, LoginData, { rejectValue: string }>(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.error || "Failed to login");
      }

      return data;
    } catch {
      return rejectWithValue("Unable to connect to the server");
    }
  },
);

export const fetchCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("auth/me", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch("http://localhost:5000/api/auth/me", {
      credentials: "include",
    });

    if (!res.ok) {
      return rejectWithValue("Unable to fetch current user");
    }

    const data = await res.json();
    return data.data;
  } catch {
    return rejectWithValue("Unable to connect to the server");
  }
});

export const logOut = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.error || "Failed to logout");
      }

      return data;
    } catch {
      return rejectWithValue("Unable to connect to the server");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    clearUser: (state) => {
      state.user = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })

      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      })

      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.message = action.payload.message;
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
      })
      // LOGOUT
      .addCase(logOut.fulfilled, (state) => {
        state.user = null;
        state.message = null;
      });
  },
});

export const { clearError, clearUser } = authSlice.actions;

export default authSlice.reducer;

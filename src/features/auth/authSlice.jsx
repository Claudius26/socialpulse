import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const Backend_URL = import.meta.env.VITE_BACKEND_BASE;

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch(`${Backend_URL}/api/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch user profile");

      const data = await response.json();

      return { user: data.user, summary: data.summary };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async ({ token, userData }, { rejectWithValue }) => {
    try {
      
      const response = await fetch(`${Backend_URL}/api/update_profile/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const data = await response.json();
      return { user: data.user, summary: data.summary }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const storedToken = localStorage.getItem("access_token");
const storedUser = localStorage.getItem("user");
const storedSummary = localStorage.getItem("summary");

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  summary: storedSummary ? JSON.parse(storedSummary) : null,
  token: storedToken || null,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      const { user, token, summary } = action.payload;

      state.user = user ?? null;
      state.summary = summary ?? state.summary ?? null;
      state.token = token ?? null;
      state.isAuthenticated = Boolean(user && token);
      state.error = null;

      if (token) localStorage.setItem("access_token", token);
      if (user) localStorage.setItem("user", JSON.stringify(user));
      if (summary) localStorage.setItem("summary", JSON.stringify(summary));
    },
    logout(state) {
      state.user = null;
      state.summary = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;

      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      localStorage.removeItem("summary");
    },
    setLoading(state, action) {
      state.loading = !!action.payload;
    },
    setError(state, action) {
      state.error = action.payload ?? null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.summary = action.payload.summary;

        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("summary", JSON.stringify(action.payload.summary));
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
     .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;

        const { user, summary } = action.payload;

        state.user = user ?? state.user;
        state.summary = summary ?? state.summary;

        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem("summary", JSON.stringify(state.summary));
      })

      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, logout, setLoading, setError } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthSummary = (state) => state.auth.summary;
export const selectAuthToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;

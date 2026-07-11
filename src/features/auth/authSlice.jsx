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

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        const msg =
          err?.username?.[0] || err?.email?.[0] || err?.phone?.[0] ||
          err?.error || err?.detail || "Failed to update profile";
        throw new Error(msg);
      }

      const data = await response.json();
      return { user: data.user, summary: data.summary }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const storedToken = localStorage.getItem("access_token");
const storedRefresh = localStorage.getItem("refresh_token");
const storedUser = localStorage.getItem("user");
const storedSummary = localStorage.getItem("summary");

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  summary: storedSummary ? JSON.parse(storedSummary) : null,
  token: storedToken || null,
  refresh: storedRefresh || null,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,
};

// Exchange a valid refresh token for a fresh access token (rotation returns a
// new refresh token too). Used by the route guard to keep users signed in
// without a full re-login when their short-lived access token has expired.
export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (_, { getState, dispatch, rejectWithValue }) => {
    const refresh = getState().auth.refresh || localStorage.getItem("refresh_token");
    if (!refresh) return rejectWithValue("no refresh token");
    try {
      const res = await fetch(`${Backend_URL}/api/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });
      if (!res.ok) {
        dispatch(logout());
        return rejectWithValue("refresh failed");
      }
      const data = await res.json();
      dispatch(setTokens({ token: data.access, refresh: data.refresh }));
      return data.access;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      const { user, token, summary, refresh } = action.payload;

      state.user = user ?? null;
      state.summary = summary ?? state.summary ?? null;
      state.token = token ?? null;
      if (refresh !== undefined) state.refresh = refresh ?? null;
      state.isAuthenticated = Boolean(user && token);
      state.error = null;

      if (token) localStorage.setItem("access_token", token);
      if (refresh) localStorage.setItem("refresh_token", refresh);
      if (user) localStorage.setItem("user", JSON.stringify(user));
      if (summary) localStorage.setItem("summary", JSON.stringify(summary));
    },
    // Update just the tokens (used after a silent refresh; rotation may return a
    // new refresh token, so persist whichever we get).
    setTokens(state, action) {
      const { token, refresh } = action.payload;
      if (token) {
        state.token = token;
        state.isAuthenticated = Boolean(state.user && token);
        localStorage.setItem("access_token", token);
      }
      if (refresh) {
        state.refresh = refresh;
        localStorage.setItem("refresh_token", refresh);
      }
    },
    logout(state) {
      state.user = null;
      state.summary = null;
      state.token = null;
      state.refresh = null;
      state.isAuthenticated = false;
      state.error = null;

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
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

export const { setUser, setTokens, logout, setLoading, setError } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthSummary = (state) => state.auth.summary;
export const selectAuthToken = (state) => state.auth.token;
export const selectRefreshToken = (state) => state.auth.refresh;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;

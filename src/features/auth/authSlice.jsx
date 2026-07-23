import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setUserAccess, getUserAccess } from "./token";

const Backend_URL = import.meta.env.VITE_BACKEND_BASE;

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch(`${Backend_URL}/api/me/`, {
        headers: { Authorization: `Bearer ${token || getUserAccess() || ""}` },
        credentials: "include",
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
          Authorization: `Bearer ${token || getUserAccess() || ""}`,
        },
        credentials: "include",
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

// Only NON-sensitive profile data is persisted. Tokens are deliberately NOT in
// localStorage — the session survives reloads via the HttpOnly refresh cookie
// (see refreshAccessToken), which JavaScript can't read.
const storedUser = localStorage.getItem("user");
const storedSummary = localStorage.getItem("summary");

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  summary: storedSummary ? JSON.parse(storedSummary) : null,
  token: null,          // in-memory only; hydrated by a cookie refresh on boot
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Exchange the HttpOnly refresh cookie for a fresh access token. No token is
// read from or sent by JavaScript — the browser attaches the cookie because of
// `credentials: "include"`. Rotation sets a new refresh cookie server-side.
//
// Concurrent callers (the boot effect + a route guard both firing on reload)
// are COALESCED into a single request. Otherwise two requests would race with
// the same rotating refresh token, and the second — now presenting a
// just-blacklisted token — would 401 and spuriously log the user out.
let _refreshPromise = null;
async function _doRefresh() {
  const res = await fetch(`${Backend_URL}/api/token/refresh/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });
  if (!res.ok) throw new Error("refresh failed");
  const data = await res.json();
  return data.access;
}
export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      if (!_refreshPromise) {
        _refreshPromise = _doRefresh().finally(() => { _refreshPromise = null; });
      }
      const access = await _refreshPromise;
      dispatch(setTokens({ token: access }));
      return access;
    } catch (e) {
      dispatch(logout());
      return rejectWithValue(e.message || "refresh failed");
    }
  }
);

// Clear the session on the server (blacklist the refresh token + wipe cookies)
// before scrubbing local state.
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch }) => {
    try {
      await fetch(`${Backend_URL}/api/logout/`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Even if the network call fails, still drop the local session below.
    }
    dispatch(logout());
  }
);

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

      setUserAccess(token || null);
      // A customer session and an admin session share one refresh cookie on this
      // origin; drop any stale admin identity so the boot refresh can't restore
      // the wrong role.
      localStorage.removeItem("adminAuth");
      if (user) localStorage.setItem("user", JSON.stringify(user));
      if (summary) localStorage.setItem("summary", JSON.stringify(summary));
    },
    // Update just the access token (after a silent refresh). Memory only.
    setTokens(state, action) {
      const { token } = action.payload;
      if (token) {
        state.token = token;
        state.isAuthenticated = Boolean(state.user && token);
        setUserAccess(token);
      }
    },
    logout(state) {
      state.user = null;
      state.summary = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;

      setUserAccess(null);
      localStorage.removeItem("user");
      localStorage.removeItem("summary");
      // Clean up any tokens left in storage by older builds.
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
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
// Refresh now lives only in the HttpOnly cookie; kept as a stub so any older
// import doesn't break. Callers should trigger refreshAccessToken() instead.
export const selectRefreshToken = () => null;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;

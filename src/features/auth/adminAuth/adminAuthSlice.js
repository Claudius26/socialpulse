import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminLoginRequest } from "../../../admin/api/adminApi";
import { setAdminAccess } from "../token";

const BASE_URL = import.meta.env.VITE_BACKEND_BASE;

// Only the admin's NON-sensitive identity is persisted. The access token lives
// in memory and the refresh token lives ONLY in an HttpOnly cookie — neither is
// written to localStorage, so XSS can't lift the admin session.
function loadSavedAdmin() {
  try {
    const raw = JSON.parse(localStorage.getItem("adminAuth"));
    if (raw && raw.username) return { username: raw.username };
  } catch {
    // ignore malformed / legacy value
  }
  return null;
}
const savedAdmin = loadSavedAdmin();

export const adminLogin = createAsyncThunk(
  "adminAuth/adminLogin",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await adminLoginRequest(formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Admin login failed");
    }
  }
);

// Refresh the admin access token from the HttpOnly refresh cookie (no token is
// read from or sent by JS). If the cookie is dead too, scrub the session.
export const refreshAdminToken = createAsyncThunk(
  "adminAuth/refreshAdminToken",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/api/token/refresh/`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      if (!res.ok) {
        dispatch(adminLogout());
        return rejectWithValue("refresh failed");
      }
      const data = await res.json();
      dispatch(setAdminTokens({ access: data.access }));
      return data.access;
    } catch (e) {
      dispatch(adminLogout());
      return rejectWithValue(e.message);
    }
  }
);

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState: {
    admin: savedAdmin,   // { username, access? } — access is memory-only
    loading: false,
    error: null,
  },
  reducers: {
    adminLogout: (state) => {
      state.admin = null;
      state.loading = false;
      state.error = null;
      setAdminAccess(null);
      localStorage.removeItem("adminAuth");
      // Best-effort server-side logout (blacklist refresh + clear cookies).
      fetch(`${BASE_URL}/api/logout/`, { method: "POST", credentials: "include" }).catch(() => {});
    },
    clearAdminError: (state) => {
      state.error = null;
    },
    // Update just the in-memory access token after a silent cookie refresh.
    setAdminTokens: (state, action) => {
      if (!state.admin) state.admin = {};
      const { access } = action.payload;
      if (access) {
        state.admin.access = access;
        setAdminAccess(access);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        const { username, access } = action.payload || {};
        state.admin = { username, access };
        setAdminAccess(access || null);
        // Persist ONLY the username (no tokens). Drop any stale customer identity
        // so the customer boot refresh can't restore the wrong role (admin and
        // customer share one refresh cookie on this origin).
        localStorage.setItem("adminAuth", JSON.stringify({ username }));
        localStorage.removeItem("user");
        localStorage.removeItem("summary");
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Admin login failed";
      });
  },
});

export const { adminLogout, clearAdminError, setAdminTokens } = adminAuthSlice.actions;

export const selectAdminAuth = (state) => state.adminAuth.admin;
export const selectAdminToken = (state) => state.adminAuth.admin?.access || null;
// Refresh now lives only in the HttpOnly cookie; stub kept for back-compat.
export const selectAdminRefresh = () => null;
export const selectAdminLoading = (state) => state.adminAuth.loading;
export const selectAdminError = (state) => state.adminAuth.error;

export default adminAuthSlice.reducer;

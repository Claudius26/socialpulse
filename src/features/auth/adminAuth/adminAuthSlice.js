import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminLoginRequest } from "../../../admin/api/adminApi";

const BASE_URL = import.meta.env.VITE_BACKEND_BASE;

const savedAdmin = JSON.parse(localStorage.getItem("adminAuth")) || null;

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

// Exchange the admin's refresh token for a fresh access token so a working
// admin isn't kicked out the moment their short-lived access token expires.
// If the refresh is also dead, scrub the session (the guard then redirects).
export const refreshAdminToken = createAsyncThunk(
  "adminAuth/refreshAdminToken",
  async (_, { getState, dispatch, rejectWithValue }) => {
    const refresh = getState().adminAuth.admin?.refresh;
    if (!refresh) {
      dispatch(adminLogout());
      return rejectWithValue("no refresh token");
    }
    try {
      const res = await fetch(`${BASE_URL}/api/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });
      if (!res.ok) {
        dispatch(adminLogout());
        return rejectWithValue("refresh failed");
      }
      const data = await res.json();
      dispatch(setAdminTokens({ access: data.access, refresh: data.refresh }));
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
    admin: savedAdmin,
    loading: false,
    error: null,
  },
  reducers: {
    adminLogout: (state) => {
      state.admin = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("adminAuth");
    },
    clearAdminError: (state) => {
      state.error = null;
    },
    // Update just the tokens after a silent refresh (rotation may hand back a
    // new refresh token, so persist whichever we get).
    setAdminTokens: (state, action) => {
      if (!state.admin) return;
      const { access, refresh } = action.payload;
      if (access) state.admin.access = access;
      if (refresh) state.admin.refresh = refresh;
      localStorage.setItem("adminAuth", JSON.stringify(state.admin));
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
        state.admin = action.payload;
        localStorage.setItem("adminAuth", JSON.stringify(action.payload));
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
export const selectAdminRefresh = (state) => state.adminAuth.admin?.refresh || null;
export const selectAdminLoading = (state) => state.adminAuth.loading;
export const selectAdminError = (state) => state.adminAuth.error;

export default adminAuthSlice.reducer;
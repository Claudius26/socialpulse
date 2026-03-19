import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminLoginRequest } from "../../../admin/api/adminApi";

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

export const { adminLogout, clearAdminError } = adminAuthSlice.actions;

export const selectAdminAuth = (state) => state.adminAuth.admin;
export const selectAdminToken = (state) => state.adminAuth.admin?.access || null;
export const selectAdminLoading = (state) => state.adminAuth.loading;
export const selectAdminError = (state) => state.adminAuth.error;

export default adminAuthSlice.reducer;
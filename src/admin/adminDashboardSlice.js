import { createSlice } from "@reduxjs/toolkit";

// Caches the last admin dashboard payload so revisits render instantly while a
// fresh copy is fetched in the background.
const initialState = { sp: null, cp: null, fetchedAt: null };

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {
    setAdminDashboard(state, action) {
      if (action.payload.sp != null) state.sp = action.payload.sp;
      if (action.payload.cp != null) state.cp = action.payload.cp;
      state.fetchedAt = Date.now();
    },
    clearAdminDashboard(state) {
      state.sp = null;
      state.cp = null;
      state.fetchedAt = null;
    },
  },
});

export const { setAdminDashboard, clearAdminDashboard } = adminDashboardSlice.actions;
export const selectAdminDashboard = (state) => state.adminDashboard;
export default adminDashboardSlice.reducer;

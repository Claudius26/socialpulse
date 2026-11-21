import { createSlice } from "@reduxjs/toolkit";
import { fetchBoostCatalogue } from "./catalogue";

const boostSlice = createSlice({
  name: "boost",
  initialState: {
    boosts: [],
    loading: false,
    error: null,
    // Full boost catalogue (platform -> type -> services), see ./catalogue.js
    catalogue: null,
    catalogueStatus: "idle",
    catalogueError: null,
    catalogueLoadedAt: 0,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoostCatalogue.pending, (state) => {
        state.catalogueStatus = "loading";
        state.catalogueError = null;
      })
      .addCase(fetchBoostCatalogue.fulfilled, (state, action) => {
        state.catalogue = action.payload;
        state.catalogueStatus = "ready";
        state.catalogueLoadedAt = Date.now();
      })
      .addCase(fetchBoostCatalogue.rejected, (state, action) => {
        // Keep showing the last good catalogue if we have one.
        state.catalogueStatus = state.catalogue ? "ready" : "error";
        state.catalogueError = action.payload || "Couldn't load boost services.";
      });
  },
  reducers: {
    setBoosts: (state, action) => {
      state.boosts = action.payload;
    },
    addBoost: (state, action) => {
      state.boosts.unshift(action.payload);
    },
    updateBoostStatus: (state, action) => {
      const { id, status } = action.payload;
      const boost = state.boosts.find((b) => b.id === id);
      if (boost) boost.status = status;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetBoosts: (state) => {
      state.boosts = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setBoosts,
  addBoost,
  updateBoostStatus,
  setLoading,
  setError,
  resetBoosts,
} = boostSlice.actions;

export default boostSlice.reducer;

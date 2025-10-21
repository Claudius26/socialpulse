import { createSlice } from "@reduxjs/toolkit";

const boostSlice = createSlice({
  name: "boost",
  initialState: {
    boosts: [],
    loading: false,
    error: null,
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

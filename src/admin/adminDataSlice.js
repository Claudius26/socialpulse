/**
 * One cache for every admin dataset — the reason the admin used to feel slow.
 *
 * Before: each page fetched into local useState on mount and rendered
 * `if (loading) return <p>Loading…</p>`, so navigating Users → Deposits → Users
 * refetched from zero and blanked the whole page every time.
 *
 * Now: data lives here. A page renders whatever is cached IMMEDIATELY (no
 * spinner), then revalidates in the background and swaps in fresh data when it
 * lands. A spinner only ever appears on a genuinely cold load.
 */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "./api/adminApi";

// How long a cached dataset is considered fresh enough to skip the background
// refetch entirely. Matches the backend's 60s admin cache TTL.
export const STALE_MS = 60_000;

// resource key -> fetcher. Adding an admin dataset means adding one line here.
const FETCHERS = {
  users: (token) => api.getAdminUsers(token),
  deposits: (token) => api.getAdminDeposits(token),
  numbers: (token) => api.getAdminNumbers(token),
  esims: (token) => api.getAdminEsims(token),
  rentals: (token) => api.getAdminRentals(token),
  finance: (token) => api.getAdminFinance(token),
  overview: (token) => api.getAdminOverview(token),
  trends: (token) => api.getAdminTrends(token),
  ads: (token) => api.getAds(token),
};

const emptyEntry = { data: null, fetchedAt: null, loading: false, error: null };

export const fetchAdminResource = createAsyncThunk(
  "adminData/fetch",
  async ({ resource, token }, { rejectWithValue }) => {
    const fetcher = FETCHERS[resource];
    if (!fetcher) return rejectWithValue(`Unknown admin resource: ${resource}`);
    try {
      return { resource, data: await fetcher(token) };
    } catch (e) {
      return rejectWithValue(e.message || "Failed to load");
    }
  },
  {
    condition: ({ resource }, { getState }) => {
      // Never run two fetches for the same resource at once.
      const entry = getState().adminData.entries[resource];
      return !entry?.loading;
    },
  }
);

const adminDataSlice = createSlice({
  name: "adminData",
  initialState: { entries: {} },
  reducers: {
    // Call after any admin mutation (block, delete, ad edit) so the next read
    // refetches instead of serving what we just changed.
    invalidateAdminResource(state, action) {
      const keys = [].concat(action.payload || []);
      keys.forEach((k) => {
        if (state.entries[k]) state.entries[k].fetchedAt = null;
      });
    },
    clearAdminData(state) {
      state.entries = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminResource.pending, (state, action) => {
        const key = action.meta.arg.resource;
        const entry = state.entries[key] || { ...emptyEntry };
        // Keep `data` in place while revalidating — this is what stops the page
        // from blanking on every navigation.
        state.entries[key] = { ...entry, loading: true, error: null };
      })
      .addCase(fetchAdminResource.fulfilled, (state, action) => {
        const { resource, data } = action.payload;
        state.entries[resource] = {
          data,
          fetchedAt: Date.now(),
          loading: false,
          error: null,
        };
      })
      .addCase(fetchAdminResource.rejected, (state, action) => {
        const key = action.meta.arg.resource;
        const entry = state.entries[key] || { ...emptyEntry };
        // Keep stale data on screen rather than throwing the page away on a
        // transient network error; surface the error alongside it.
        state.entries[key] = {
          ...entry,
          loading: false,
          error: action.payload || "Failed to load",
        };
      });
  },
});

export const { invalidateAdminResource, clearAdminData } = adminDataSlice.actions;

export const selectAdminEntry = (resource) => (state) =>
  state.adminData.entries[resource] || emptyEntry;

export default adminDataSlice.reducer;

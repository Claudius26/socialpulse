/**
 * Boost catalogue: every platform -> type -> services (priced per 1000 in the
 * wallet currency) from ONE backend call, kept in the Redux store.
 *
 * Stale-while-revalidate: whatever is already in the store renders instantly,
 * and every visit fetches fresh prices in the background and swaps them in —
 * so the page is never blank and never shows old prices for long.
 */
import { createAsyncThunk } from "@reduxjs/toolkit";

const API = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8000";

// The last catalogue is also kept in the browser, so even a fresh page load
// shows services instantly while current prices download in the background.
// (Orders are still safe: the server refuses with the new price — 409 — if the
// shown total is out of date.)
const STORE_KEY = "sp_boost_catalogue_v1";
const STORE_MAX_AGE = 24 * 60 * 60 * 1000;

export function loadPersistedCatalogue() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    const { savedAt, data } = JSON.parse(raw);
    if (!data?.platforms || Date.now() - savedAt > STORE_MAX_AGE) return null;
    return data;
  } catch {
    return null;
  }
}

function persistCatalogue(data) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({ savedAt: Date.now(), data }));
  } catch {
    /* storage full / private mode — the in-memory store still works */
  }
}

export const fetchBoostCatalogue = createAsyncThunk(
  "boost/fetchCatalogue",
  async (token, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API}/api/boost/catalogue/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.platforms) {
        return rejectWithValue(data?.error || "Couldn't load boost services. Please try again.");
      }
      persistCatalogue(data);
      return data;
    } catch {
      return rejectWithValue("Network error loading boost services.");
    }
  },
  {
    // One request at a time — mounting the page while a prefetch is running
    // (e.g. from the dashboard) shouldn't fire a second one.
    condition: (_token, { getState }) => getState().boosts?.catalogueStatus !== "loading",
  }
);

/**
 * The SAME rule the backend charges with (boost/catalog.py total_for):
 * rate x qty / 1000, rounded UP to the currency's smallest unit. toFixed(6)
 * strips float noise first so 1440 x 333 / 1000 doesn't round up a cent.
 */
export function estimateTotal(rate, quantity, decimals = 2) {
  const r = Number(rate);
  const q = Number(quantity);
  if (!Number.isFinite(r) || !Number.isFinite(q) || q <= 0) return 0;
  const scale = 10 ** decimals;
  return Math.ceil(Number(((r * q) / 1000 * scale).toFixed(6))) / scale;
}

export const selectBoostCatalogue = (state) => state.boosts?.catalogue || null;
export const selectBoostCatalogueStatus = (state) => state.boosts?.catalogueStatus || "idle";
export const selectBoostCatalogueError = (state) => state.boosts?.catalogueError || null;

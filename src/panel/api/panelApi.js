// API client for the REGULAR referral-admin panel. Talks only to /api/panel/*,
// which the server scopes to this admin's own referred users. Auth rides the
// same HttpOnly session cookie as the rest of the admin area (credentials:
// "include"); the in-memory access token is attached when present.
import { getAdminAccess } from "../../features/auth/token";

const BASE = import.meta.env.VITE_BACKEND_BASE;

async function handle(res) {
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  if (!res.ok) {
    throw new Error(
      data?.error || data?.detail || data?.message || "Something went wrong"
    );
  }
  return data;
}

function init(method = "GET", body) {
  const token = getAdminAccess();
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;
  const opts = { method, headers, credentials: "include" };
  if (body !== undefined) opts.body = JSON.stringify(body);
  return opts;
}

export const getPanelMe = () => fetch(`${BASE}/api/panel/me/`, init()).then(handle);
export const getPanelUsers = () => fetch(`${BASE}/api/panel/users/`, init()).then(handle);
export const getPanelUserDetail = (id) =>
  fetch(`${BASE}/api/panel/users/${id}/`, init()).then(handle);
export const blockPanelUser = (id) =>
  fetch(`${BASE}/api/panel/users/${id}/block/`, init("POST", {})).then(handle);
export const unblockPanelUser = (id) =>
  fetch(`${BASE}/api/panel/users/${id}/unblock/`, init("POST", {})).then(handle);

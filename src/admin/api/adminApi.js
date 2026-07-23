const BASE_URL = import.meta.env.VITE_BACKEND_BASE;

async function handleResponse(response) {
  let data = null;

  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  if (!response.ok) {
    const errorMessage =
      data?.error ||
      data?.message ||
      data?.detail ||
      data?.non_field_errors?.[0] ||
      data?.[0] ||
      "Something went wrong";

    throw new Error(errorMessage);
  }

  return data;
}

// Auth for the admin panel rides the HttpOnly session cookie (credentials:
// "include"). The Bearer header is sent too when an in-memory access token is
// available, but is optional — the cookie is the source of truth and JavaScript
// never has to hold the token.
function authInit(token, { method = "GET", body, json = true } = {}) {
  const headers = {};
  if (json && body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;
  const init = { method, headers, credentials: "include" };
  if (body !== undefined) init.body = json ? JSON.stringify(body) : body;
  return init;
}

export async function adminLoginRequest(payload) {
  const response = await fetch(`${BASE_URL}/api/admin/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",   // store the HttpOnly session cookies
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

export async function getAdminUsers(token) {
  const response = await fetch(`${BASE_URL}/api/deposit/admin/users/`, authInit(token));
  return handleResponse(response);
}

export async function getAdminDeposits(token) {
  const response = await fetch(`${BASE_URL}/api/deposit/admin/deposits/`, authInit(token));
  return handleResponse(response);
}

export async function getAdminOverview(token) {
  const response = await fetch(`${BASE_URL}/api/deposit/admin/overview/`, authInit(token));
  return handleResponse(response);
}

// One user's full picture: wallet, spend breakdown, profit they generated,
// unified transaction feed, and a reserved-funds integrity check.
export async function getAdminUserDetail(token, userId) {
  const response = await fetch(`${BASE_URL}/api/deposit/admin/users/${userId}/`, authInit(token));
  return handleResponse(response);
}

// Platform money health: liability, revenue, profit (numbers + boost), and any
// accounts whose reserved funds don't reconcile (possible missing/stuck money).
export async function getAdminFinance(token) {
  const response = await fetch(`${BASE_URL}/api/deposit/admin/finance/`, authInit(token));
  return handleResponse(response);
}

export async function getAdminNumbers(token, query = "") {
  const response = await fetch(`${BASE_URL}/api/deposit/admin/numbers/${query}`, authInit(token));
  return handleResponse(response);
}

export async function getAdminNumberSms(token, numberId) {
  const response = await fetch(`${BASE_URL}/api/deposit/admin/numbers/${numberId}/sms/`, authInit(token));
  return handleResponse(response);
}

// --------------------------------------------------------------------------- //
// Shared auth fetch helpers
// --------------------------------------------------------------------------- //
const authGet = (token, path) =>
  fetch(`${BASE_URL}${path}`, authInit(token)).then(handleResponse);

const authPost = (token, path, body) =>
  fetch(`${BASE_URL}${path}`, authInit(token, { method: "POST", body })).then(handleResponse);

const authPut = (token, path, body) =>
  fetch(`${BASE_URL}${path}`, authInit(token, { method: "PUT", body })).then(handleResponse);

const authPatch = (token, path, body) =>
  fetch(`${BASE_URL}${path}`, authInit(token, { method: "PATCH", body })).then(handleResponse);

const authDelete = (token, path) =>
  fetch(`${BASE_URL}${path}`, authInit(token, { method: "DELETE" }))
    .then((r) => (r.status === 204 ? { ok: true } : handleResponse(r)));

// ---- eSIMs & rentals ----
// Each eSIM carries its reloads (topups) nested, with total_charged = initial
// sale + every reload. Each rental carries its charge ledger, so the initial
// rent and every reactivation are itemised with their own dates.
export const getAdminEsims = (t) => authGet(t, "/api/deposit/admin/esims/");
export const getAdminRentals = (t) => authGet(t, "/api/deposit/admin/rentals/");

// ---- User management ----
// block      -> user can still log in and FUND, but every purchase is refused.
//               Only an admin can unblock.
// deleteUser -> hard delete, irreversible; frees the email to register again.
//
// There is deliberately NO admin endpoint for a user's own deactivation:
// is_self_deactivated is owned by the user and only they can lift it.
export const blockUser = (t, id) => authPost(t, `/api/deposit/admin/users/${id}/block/`);
export const unblockUser = (t, id) => authPost(t, `/api/deposit/admin/users/${id}/unblock/`);
export const deleteUser = (t, id) => authDelete(t, `/api/deposit/admin/users/${id}/delete/`);

// ---- Shared by both admin tiers: API/provider health ----
export const getApiBalances = (t) => authGet(t, "/api/adminpanel/providers/balances/");
export const getApiUsage = (t) => authGet(t, "/api/adminpanel/providers/usage/");

// ---- Super-admin: manage referral admins (/api/superadmin/*) ----
export const getAdmins = (t) => authGet(t, "/api/superadmin/admins/");
export const createAdmin = (t, body) => authPost(t, "/api/superadmin/admins/", body);
export const getAdminOne = (t, id) => authGet(t, `/api/superadmin/admins/${id}/`);
export const suspendAdmin = (t, id) => authPost(t, `/api/superadmin/admins/${id}/suspend/`);
export const unsuspendAdmin = (t, id) => authPost(t, `/api/superadmin/admins/${id}/unsuspend/`);
export const changeAdminCredentials = (t, id, body) =>
  authPut(t, `/api/superadmin/admins/${id}/credentials/`, body);
export const deleteAdmin = (t, id) => authPost(t, `/api/superadmin/admins/${id}/delete/`);

// ---- Ads ----
export const getAds = (t) => authGet(t, "/api/ads/admin/");
export const createAd = (t, body) => authPost(t, "/api/ads/admin/", body);
export const updateAd = (t, id, body) => authPatch(t, `/api/ads/admin/${id}/`, body);
export const deleteAd = (t, id) => authDelete(t, `/api/ads/admin/${id}/`);
// Upload an image file from the admin's device; returns { url } to save on the ad.
// No Content-Type header — the browser sets the multipart boundary itself.
export const uploadAdImage = (t, file) => {
  const fd = new FormData();
  fd.append("file", file);
  return fetch(
    `${BASE_URL}/api/ads/admin/upload/`,
    authInit(t, { method: "POST", body: fd, json: false })
  ).then(handleResponse);
};

// ---- CardPulse admin (one admin controls both products) ----
const CP = "/api/v1/cardpulse/admin";
export const getCardpulseOverview = (t) => authGet(t, `${CP}/overview/`);
export const getAdminTrends = (t) => authGet(t, `${CP}/trends/`);
export const getCardpulseUsers = (t) => authGet(t, `${CP}/users/`);
export const getCardpulseProfit = (t) => authGet(t, `${CP}/profit/`);

export const getCardpulseTrades = (t, status = "pending_review") =>
  authGet(t, `${CP}/trades/?status=${status}`);
export const approveTrade = (t, id) => authPost(t, `${CP}/trades/${id}/approve/`);
export const rejectTrade = (t, id, reason) => authPost(t, `${CP}/trades/${id}/reject/`, { reason });

export const getCardpulseSales = (t, status = "pending_validation") =>
  authGet(t, `${CP}/sales/?status=${status}`);
export const approveSale = (t, id) => authPost(t, `${CP}/sales/${id}/approve/`);
export const rejectSale = (t, id, reason) => authPost(t, `${CP}/sales/${id}/reject/`, { reason });

export const getCardpulseWithdrawals = (t, status = "pending_review") =>
  authGet(t, `${CP}/withdrawals/?status=${status}`);
export const approveWithdrawal = (t, id) => authPost(t, `${CP}/withdrawals/${id}/approve/`);
export const rejectWithdrawal = (t, id, reason) => authPost(t, `${CP}/withdrawals/${id}/reject/`, { reason });

// ---- Admin profile (change email / username / password) ----
export const getAdminProfile = (t) => authGet(t, `/api/admin/profile/`);
export const updateAdminProfile = (t, body) => authPut(t, `/api/admin/profile/update/`, body);
export const changeAdminPassword = (t, body) => authPut(t, `/api/admin/profile/change-password/`, body);

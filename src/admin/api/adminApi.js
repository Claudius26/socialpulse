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

export async function adminLoginRequest(payload) {
  const response = await fetch(`${BASE_URL}/api/admin/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

export async function getAdminUsers(token) {
  const response = await fetch(`${BASE_URL}/api/deposit/admin/users/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}

export async function getAdminDeposits(token) {
  const response = await fetch(`${BASE_URL}/api/deposit/admin/deposits/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}

export async function getAdminOverview(token) {
  const response = await fetch(`${BASE_URL}/api/deposit/admin/overview/`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
}

export async function getAdminNumbers(token, query = "") {
  const response = await fetch(`${BASE_URL}/api/deposit/admin/numbers/${query}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
}

export async function getAdminNumberSms(token, numberId) {
  const response = await fetch(`${BASE_URL}/api/deposit/admin/numbers/${numberId}/sms/`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
}

export async function confirmManualDeposit(token, depositId) {
  const response = await fetch(
    `${BASE_URL}/api/deposit/admin/manual/confirm/${depositId}/`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return handleResponse(response);
}

export async function rejectManualDeposit(token, depositId, reason) {
  const response = await fetch(
    `${BASE_URL}/api/deposit/admin/manual/reject/${depositId}/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    }
  );

  return handleResponse(response);
}

// --------------------------------------------------------------------------- //
// Shared auth fetch helpers
// --------------------------------------------------------------------------- //
const authGet = (token, path) =>
  fetch(`${BASE_URL}${path}`, { headers: { Authorization: `Bearer ${token}` } }).then(handleResponse);

const authPost = (token, path, body) =>
  fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: body ? JSON.stringify(body) : undefined,
  }).then(handleResponse);

const authPut = (token, path, body) =>
  fetch(`${BASE_URL}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  }).then(handleResponse);

// ---- CardPulse admin (one admin controls both products) ----
const CP = "/api/v1/cardpulse/admin";
export const getCardpulseOverview = (t) => authGet(t, `${CP}/overview/`);
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
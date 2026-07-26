// Customer-facing support-chat API. Token-first wrappers with a local response
// handler (mirrors the shape used across the app). Auth rides the Bearer header
// plus the HttpOnly session cookie (credentials: "include").
const BASE = import.meta.env.VITE_BACKEND_BASE;

async function handleResponse(res) {
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

function init(token, method = "GET", body) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;
  const opts = { method, headers, credentials: "include" };
  if (body !== undefined) opts.body = JSON.stringify(body);
  return opts;
}

// GET the customer's conversation + messages.
export const getSupport = (token) =>
  fetch(`${BASE}/api/support-chat/`, init(token)).then(handleResponse);

// POST a new message. The server may generate an AI reply asynchronously when
// the conversation is in AI mode (it arrives via WebSocket / next poll).
export const sendSupport = (token, message) =>
  fetch(`${BASE}/api/support-chat/`, init(token, "POST", { message })).then(
    handleResponse
  );

// PATCH one of the customer's own recent messages (30-min window, `can_edit`).
export const editSupport = (token, id, message) =>
  fetch(
    `${BASE}/api/support-chat/messages/${id}/`,
    init(token, "PATCH", { message })
  ).then(handleResponse);

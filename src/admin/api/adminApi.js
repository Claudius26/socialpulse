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
  const response = await fetch(`${BASE_URL}/accounts/admin/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

export async function getAdminUsers(token) {
  const response = await fetch(`${BASE_URL}/payments/admin/users/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}

export async function getAdminDeposits(token) {
  const response = await fetch(`${BASE_URL}/payments/admin/deposits/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}

export async function confirmManualDeposit(token, depositId) {
  const response = await fetch(
    `${BASE_URL}/payments/admin/manual/confirm/${depositId}/`,
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
    `${BASE_URL}/payments/admin/manual/reject/${depositId}/`,
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
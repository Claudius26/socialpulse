import { useEffect } from "react";
import { getUserAccess, setUserAccess } from "../features/auth/token";
import { useNavigate, useLocation } from "react-router";

function DepositCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  const backendBase = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8000";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const depositId = params.get("deposit_id");

    if (!depositId) {
      navigate("/dashboard");
      return;
    }

    let cancelled = false;

    // Returning from the payment page reloaded the SPA, so the in-memory access
    // token is gone. Mint a fresh one from the HttpOnly refresh cookie BEFORE
    // checking status — otherwise the status call 401s and we'd wrongly show
    // "failed" for a deposit that actually succeeded.
    const ensureToken = async () => {
      const existing = getUserAccess();
      if (existing) return existing;
      try {
        const res = await fetch(`${backendBase}/api/token/refresh/`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: "{}",
        });
        if (res.ok) {
          const d = await res.json();
          if (d.access) {
            setUserAccess(d.access);
            return d.access;
          }
        }
      } catch {
        /* ignore — we'll still try the status call, then fall back to pending */
      }
      return null;
    };

    const fetchStatus = async (token) => {
      const res = await fetch(`${backendBase}/api/deposit/status/${depositId}/`, {
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const data = await res.json();
      return data.status;
    };

    const run = async () => {
      const token = await ensureToken();
      // The wallet is credited by an ASYNC webhook, which can land a couple of
      // seconds after the redirect — poll a few times before deciding.
      for (let i = 0; i < 6 && !cancelled; i++) {
        try {
          const status = await fetchStatus(token);
          if (status === "paid") {
            if (!cancelled) navigate(`/deposit/success?deposit_id=${depositId}`);
            return;
          }
          if (status === "failed") {
            if (!cancelled) navigate(`/deposit/failed?deposit_id=${depositId}`);
            return;
          }
        } catch {
          // Auth/network hiccup — NOT a payment failure. Keep trying.
        }
        await new Promise((r) => setTimeout(r, 2000));
      }
      // Still unsettled: treat as PENDING (the money isn't lost — the webhook
      // will finish crediting). Never dump a real payment on the failed page.
      if (!cancelled) navigate(`/deposit/pending?deposit_id=${depositId}`);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [location.search, navigate, backendBase]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 px-4">
      <div className="card p-8 text-center max-w-sm w-full">
        <div className="mb-5 animate-spin rounded-full h-12 w-12 border-4 border-slate-200 dark:border-slate-700 border-t-brand-600 mx-auto"></div>
        <p className="text-lg font-semibold text-slate-900 dark:text-white">
          Verifying your payment...
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Please wait a moment.
        </p>
      </div>
    </div>
  );
}

export default DepositCallback;

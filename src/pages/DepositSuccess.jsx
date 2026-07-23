import { useEffect, useState } from "react";
import { getUserAccess } from "../features/auth/token";
import { useNavigate, useLocation } from "react-router";
import { useDispatch } from "react-redux";
import { CheckCircle2, Home, Loader2 } from "lucide-react";
import { fetchUserProfile } from "../features/auth/authSlice";

const money = (v) => Number(v ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 });

function DepositSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [deposit, setDeposit] = useState(null);
  const [loading, setLoading] = useState(true);

  const backendBase = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8000";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const depositId = params.get("deposit_id");
    if (!depositId) {
      navigate("/dashboard");
      return;
    }

    const token = getUserAccess();
    let tries = 0;
    let timer;
    let cancelled = false;

    const tick = async () => {
      try {
        const res = await fetch(`${backendBase}/api/deposit/status/${depositId}/`, {
          credentials: "include",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (cancelled) return;
        setDeposit(data);

        // Refresh the Redux store from /me so the wallet balance updates
        // everywhere — no more logout/login needed to see the money.
        if (token) dispatch(fetchUserProfile(token));

        // Crypto can still be confirming when the user returns from checkout —
        // poll briefly so the balance catches up the moment the webhook lands.
        if (data.status !== "paid" && tries < 6) {
          tries += 1;
          timer = setTimeout(tick, 3000);
        }
      } catch (err) {
        console.error("Failed to fetch deposit info:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    tick();
    return () => { cancelled = true; clearTimeout(timer); };
  }, [location.search, navigate, dispatch, backendBase]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <p className="text-slate-500 dark:text-slate-400 text-lg animate-pulse">
          Loading deposit info...
        </p>
      </div>
    );

  if (!deposit)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <p className="text-rose-600 dark:text-rose-400 text-center text-lg">
          Deposit not found or still processing.
        </p>
      </div>
    );

  const cur = deposit.currency || "NGN";
  const pending = deposit.status && deposit.status !== "paid";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
      <div className="card p-6 sm:p-8 text-center max-w-md w-full">
        <div className="flex justify-center mb-5">
          <span className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${pending ? "bg-amber-50 dark:bg-amber-950" : "bg-emerald-50 dark:bg-emerald-950"}`}>
            {pending
              ? <Loader2 className="text-amber-600 dark:text-amber-400 w-9 h-9 animate-spin" />
              : <CheckCircle2 className="text-emerald-600 dark:text-emerald-400 w-9 h-9" />}
          </span>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          {pending ? "Confirming your payment…" : "Payment Successful!"}
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mb-5">
          {pending ? (
            <>Your deposit of{" "}
              <span className="font-semibold text-brand-600 dark:text-brand-400">
                {cur} {money(deposit.amount)}
              </span>{" "}
              is being confirmed. Your balance updates automatically here.</>
          ) : (
            <>You’ve successfully credited your wallet with{" "}
              <span className="font-semibold text-brand-600 dark:text-brand-400">
                {cur} {money(deposit.amount)}
              </span>.</>
          )}
        </p>
        {deposit.balance != null && (
          <div className="mb-6 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-100 dark:border-emerald-900 p-4">
            <p className="text-emerald-700 dark:text-emerald-300 text-sm">
              Current Wallet Balance:{" "}
              <span className="font-semibold">{cur} {money(deposit.balance)}</span>
            </p>
          </div>
        )}
        <button
          onClick={() => navigate("/dashboard")}
          className="btn btn-md btn-primary w-full"
        >
          <Home size={18} /> Return to Dashboard
        </button>
      </div>
    </div>
  );
}

export default DepositSuccess;

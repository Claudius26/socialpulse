import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { CheckCircle2, Home } from "lucide-react";

function DepositSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [deposit, setDeposit] = useState(null);
  const [loading, setLoading] = useState(true);

  const backendBase = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8000";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const depositId = params.get("deposit_id");
    const reference = params.get("reference");
      console.log("Deposit Success Params:", { depositId, reference });

    if (!depositId) {
      navigate("/dashboard");
      return;
    }

    const token = localStorage.getItem("access_token");

    const fetchDeposit = async () => {
      try {
        const res = await fetch(
          `${backendBase}/api/deposit/status/${depositId}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();

        console.log("Deposit API response:", data);
        console.log("Wallet balance from backend:", data.balance);

        setDeposit(data);

        localStorage.setItem("wallet_balance", data.balance);
        window.dispatchEvent(new Event("walletUpdate"));
      } catch (err) {
        console.error("Failed to fetch deposit info:", err);
        alert("Failed to fetch deposit info.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeposit();
  }, [location.search, navigate]);

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
      <div className="card p-6 sm:p-8 text-center max-w-md w-full">
        <div className="flex justify-center mb-5">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950">
            <CheckCircle2 className="text-emerald-600 dark:text-emerald-400 w-9 h-9" />
          </span>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Payment Successful!
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mb-5">
          You’ve successfully credited your wallet with{" "}
          <span className="font-semibold text-brand-600 dark:text-brand-400">
            ₦{deposit.amount.toLocaleString()}
          </span>
          .
        </p>
        <div className="mb-6 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-100 dark:border-emerald-900 p-4">
          <p className="text-emerald-700 dark:text-emerald-300 text-sm">
            Current Wallet Balance:{" "}
            <span className="font-semibold">
              ₦{deposit.balance.toLocaleString()}
            </span>
          </p>
        </div>
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

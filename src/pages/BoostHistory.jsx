import { useEffect, useState } from "react";
import { getUserAccess } from "../features/auth/token";
import { useNavigate } from "react-router";
import { History, ArrowLeft, CheckCircle2, XCircle, Clock } from "lucide-react";

export default function BoostHistory() {
  const [boosts, setBoosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

   const backendBase = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8000";

  useEffect(() => {
    const fetchBoosts = async () => {
      try {
        const token = getUserAccess();
        const res = await fetch(`${backendBase}/api/boost/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

        const data = await res.json();
        setBoosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBoosts();
    const interval = setInterval(fetchBoosts, 20000);
    return () => clearInterval(interval);
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <p className="text-center text-slate-500 dark:text-slate-400 pt-16 text-sm sm:text-base">
          Loading your boost history...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <p className="text-center text-rose-500 pt-16 text-sm sm:text-base">
          Error: {error}
        </p>
      </div>
    );

  if (boosts.length === 0)
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 sm:px-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-950/40 mb-4">
            <History className="w-7 h-7 text-brand-600" />
          </div>
          <p className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-2">
            Nothing to see here.
          </p>
          <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm sm:text-base">
            Boost your social platform to get more engagement.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="btn btn-md btn-primary w-full sm:w-auto"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );

  const statusChip = (status) => {
    if (status === "Completed")
      return (
        <span className="inline-flex items-center gap-1 text-xs sm:text-sm px-3 py-1 rounded-full w-fit bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {status}
        </span>
      );
    if (status === "Failed")
      return (
        <span className="inline-flex items-center gap-1 text-xs sm:text-sm px-3 py-1 rounded-full w-fit bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400">
          <XCircle className="w-3.5 h-3.5" />
          {status}
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1 text-xs sm:text-sm px-3 py-1 rounded-full w-fit bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
        <Clock className="w-3.5 h-3.5" />
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container-app py-8 md:py-12">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3 sm:gap-0">
          <div>
            <p className="eyebrow inline-flex items-center gap-1.5 mb-1">
              <History className="w-4 h-4" />
              History
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              Boost History
            </h1>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="btn btn-md btn-outline w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Dashboard
          </button>
        </div>

        <div className="grid gap-4">
          {boosts.map((boost) => (
            <div
              key={boost.id}
              className="card card-hover p-4 sm:p-5 break-words"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                <h2 className="font-semibold text-base sm:text-lg text-slate-900 dark:text-white mb-1 sm:mb-0">
                  {boost.platform} - {boost.service}
                </h2>
                {statusChip(boost.status)}
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 mb-1 break-all">
                Target:{" "}
                <a
                  href={boost.target}
                  className="text-brand-600 hover:underline break-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {boost.target}
                </a>
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">Quantity: {boost.quantity}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Amount: ₦{parseFloat(boost.amount).toLocaleString()}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Ordered: {new Date(boost.created_at).toLocaleString()}
              </p>
              {boost.delivery_time && (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Estimated Delivery: {boost.delivery_time}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

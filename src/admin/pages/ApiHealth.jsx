import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Activity, TrendingUp } from "lucide-react";
import { selectAdminToken } from "../../features/auth/adminAuth/adminAuthSlice";
import { getApiBalances, getApiUsage } from "../api/adminApi";

const ngn = (v) => `₦${Number(v || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

/**
 * API/provider health — shown to BOTH admin tiers. Balances (with the low-line)
 * plus the most-used-provider ranking that tracks which API is doing the work.
 */
export default function ApiHealth() {
  const token = useSelector(selectAdminToken);
  const [balances, setBalances] = useState(null);
  const [usage, setUsage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    Promise.all([getApiBalances(token), getApiUsage(token)])
      .then(([b, u]) => { setBalances(b); setUsage(u.providers || []); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p className="text-slate-500 dark:text-slate-300">Loading API health…</p>;
  if (error) return <p className="text-rose-600">{error}</p>;

  const providers = balances?.providers || [];
  const maxUse = Math.max(1, ...usage.map((u) => u.total));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Activity /> API Health
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Balance in each SMS provider and which one is doing the most work.
          Alerts fire below {ngn(balances?.threshold_ngn)}.
        </p>
      </div>

      {/* Balances */}
      <h2 className="font-bold text-slate-900 dark:text-white mb-3">Provider balances</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {providers.map((p) => (
          <div
            key={p.key}
            className={`rounded-2xl border p-4 ${
              p.low
                ? "border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1c17]"
            }`}
          >
            <p className="text-sm text-slate-500 dark:text-slate-400">{p.name}</p>
            {p.reportable ? (
              <>
                <p className={`text-xl font-bold mt-1 tabular-nums ${p.low ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-white"}`}>
                  {ngn(p.balance_ngn)}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {p.native_balance} {p.currency}{p.low ? " · LOW" : ""}
                </p>
              </>
            ) : (
              <p className="text-sm text-slate-400 mt-2 italic">No balance API</p>
            )}
          </div>
        ))}
      </div>

      {/* Usage ranking */}
      <h2 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
        <TrendingUp size={18} /> Most-used providers
      </h2>
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1c17] p-5 space-y-3">
        {usage.length === 0 && <p className="text-slate-400 text-sm">No purchases yet.</p>}
        {usage.map((u) => (
          <div key={u.provider}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-slate-800 dark:text-slate-200">{u.name}</span>
              <span className="text-slate-500 dark:text-slate-400 tabular-nums">
                {u.total} sold · {ngn(u.revenue)}
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-600" style={{ width: `${(u.total / maxUse) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { ArrowLeft, ShieldCheck, ShieldAlert, RefreshCw } from "lucide-react";
import { selectAdminToken } from "../../features/auth/adminAuth/adminAuthSlice";
import { getAdminUserDetail } from "../api/adminApi";

const money = (v, c = "NGN") =>
  `${Number(v || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${c}`;

function Stat({ label, value, tint }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`text-xl font-bold mt-1 tabular-nums ${tint || "text-slate-900 dark:text-white"}`}>
        {value}
      </p>
    </div>
  );
}

const TYPE_BADGE = {
  deposit: "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400",
  number: "bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400",
  boost: "bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-400",
};

export default function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useSelector(selectAdminToken);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (silent) => {
    try {
      if (!silent) setLoading(true);
      setError("");
      setData(await getAdminUserDetail(token, id));
    } catch (e) {
      setError(e.message || "Failed to load user");
    } finally {
      setLoading(false);
    }
  }, [token, id]);

  useEffect(() => {
    if (token) load();
  }, [token, load]);

  if (loading) return <p className="text-slate-600 dark:text-slate-300">Loading user…</p>;
  if (error) return <p className="text-rose-600">{error}</p>;
  if (!data) return null;

  const { user, wallet, totals, counts, funds_check, transactions } = data;
  const cur = wallet.currency || "NGN";

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white truncate">
            {user.full_name || user.username}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm truncate">
            {user.email} · {user.country || "—"} ·{" "}
            <span className={user.app === "cardpulse" ? "text-violet-500" : "text-sky-500"}>
              {user.app === "cardpulse" ? "CardPulse" : "SocialPulse"}
            </span>
          </p>
        </div>
        <button
          onClick={() => load(true)}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Refresh"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Funds integrity banner */}
      {funds_check.ok ? (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 p-4 mb-6">
          <ShieldCheck size={20} />
          <p className="text-sm font-medium">
            Funds reconciled — reserved balance matches held numbers exactly.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 p-4 mb-6">
          <div className="flex items-center gap-3 text-rose-700 dark:text-rose-300 mb-2">
            <ShieldAlert size={20} />
            <p className="text-sm font-semibold">
              Funds discrepancy detected — money may be stuck or missing.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-rose-800 dark:text-rose-200">
            <div>Reserved (stored): <b>{money(funds_check.reserved_stored, cur)}</b></div>
            <div>Reserved (expected): <b>{money(funds_check.reserved_expected, cur)}</b></div>
            <div>Delta: <b>{money(funds_check.reserved_delta, cur)}</b></div>
          </div>
        </div>
      )}

      {/* Wallet + spend */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Stat label="Balance" value={money(wallet.balance, cur)} tint="text-emerald-600 dark:text-emerald-400" />
        <Stat label="Reserved (held)" value={money(wallet.reserved_balance, cur)} />
        <Stat label="API credit" value={money(wallet.api_balance, cur)} />
        <Stat label="Deposited (total)" value={money(totals.deposited, cur)} tint="text-sky-600 dark:text-sky-400" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat label="Spent on numbers" value={money(totals.spent_on_numbers, cur)} />
        <Stat label="Spent on boost" value={money(totals.spent_on_boost, cur)} />
        <Stat label="Overall spending" value={money(totals.overall_spending, cur)} tint="text-slate-900 dark:text-white" />
        <Stat label="Profit generated" value={money(totals.profit_generated_ngn, "NGN")} tint="text-brand-600 dark:text-brand-400" />
      </div>

      {/* Transactions */}
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
        Transactions{" "}
        <span className="text-sm font-normal text-slate-400">
          ({counts.deposits} deposits · {counts.numbers} numbers · {counts.boosts} boosts)
        </span>
      </h2>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400">
            <tr className="text-left">
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Type</th>
              <th className="p-4 font-medium">Detail</th>
              <th className="p-4 font-medium text-right">Amount</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-slate-400">No transactions.</td></tr>
            )}
            {transactions.map((t, i) => (
              <tr key={i} className="border-t border-slate-100 dark:border-slate-800/60 text-slate-800 dark:text-slate-200">
                <td className="p-4 text-slate-500 text-xs whitespace-nowrap">
                  {t.date ? new Date(t.date).toLocaleString() : "—"}
                </td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${TYPE_BADGE[t.type] || "bg-slate-100 text-slate-600"}`}>
                    {t.type}
                  </span>
                </td>
                <td className="p-4">{t.detail || "—"}</td>
                <td className="p-4 text-right tabular-nums whitespace-nowrap">{money(t.amount, t.currency || cur)}</td>
                <td className="p-4 text-slate-500">{t.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

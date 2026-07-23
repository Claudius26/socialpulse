import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Ban, CircleCheck, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import { getPanelUserDetail, blockPanelUser, unblockPanelUser } from "../api/panelApi";

const money = (v, c = "NGN") =>
  `${c === "NGN" ? "₦" : c + " "}${Number(v || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const TYPE_LABEL = {
  deposit: "Deposit", number: "Number", boost: "Boost",
  esim: "eSIM", esim_topup: "eSIM reload", rental: "Rental",
  rental_reactivation: "Rental reactivation",
};

function Stat({ label, value, tint }) {
  return (
    <div className="bg-white dark:bg-[#0d1c17] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`text-xl font-bold mt-1 tabular-nums ${tint || "text-slate-900 dark:text-white"}`}>{value}</p>
    </div>
  );
}

export default function PanelUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback((silent) => {
    if (!silent) setLoading(true);
    getPanelUserDetail(id)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <p className="text-slate-500 dark:text-slate-300">Loading…</p>;
  if (error && !data) return <p className="text-rose-600">{error}</p>;
  if (!data) return null;

  const { user, wallet, totals, transactions } = data;
  const cur = wallet.currency || "NGN";

  const toggleBlock = async () => {
    setBusy(true);
    try {
      if (user.is_blocked) { await unblockPanelUser(id); toast.success("User unblocked"); }
      else { await blockPanelUser(id); toast.success("User blocked"); }
      load(true);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5" aria-label="Back">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white truncate">{user.full_name || user.username}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm truncate">{user.email} · {user.country || "—"}</p>
        </div>
        <button onClick={() => load(true)} className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5" aria-label="Refresh">
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Status + block control */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1c17] p-4 mb-6 flex flex-wrap items-center gap-3">
        <span className="text-sm font-semibold text-slate-900 dark:text-white">Status:</span>
        {user.is_blocked ? (
          <span className="text-xs font-bold px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">BLOCKED — can fund, cannot purchase</span>
        ) : (
          <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">ACTIVE</span>
        )}
        <div className="flex-1" />
        <button
          disabled={busy}
          onClick={toggleBlock}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold disabled:opacity-50 ${
            user.is_blocked
              ? "border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950"
              : "border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950"
          }`}
        >
          {user.is_blocked ? <><CircleCheck size={16} /> Unblock</> : <><Ban size={16} /> Block</>}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Stat label="Wallet balance" value={money(wallet.balance, cur)} tint="text-emerald-600 dark:text-emerald-400" />
        <Stat label="Deposited" value={money(totals.deposited, cur)} />
        <Stat label="Total spent" value={money(totals.overall_spending, cur)} />
        <Stat label="Reserved" value={money(wallet.reserved_balance, cur)} />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Stat label="On numbers" value={money(totals.spent_on_numbers, cur)} />
        <Stat label="On boost" value={money(totals.spent_on_boost, cur)} />
        <Stat label="On eSIM" value={money(totals.spent_on_esim, cur)} />
        <Stat label="On rentals" value={money(totals.spent_on_rentals, cur)} />
      </div>

      {/* Transaction feed */}
      <div className="bg-white dark:bg-[#0d1c17] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400">
            <tr className="text-left">
              <th className="p-4">Type</th>
              <th className="p-4">Detail</th>
              <th className="p-4">Provider</th>
              <th className="p-4 text-right">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {(transactions || []).length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-slate-400">No transactions.</td></tr>
            )}
            {(transactions || []).map((t, i) => (
              <tr key={i} className="border-t border-slate-100 dark:border-slate-800/60 text-slate-800 dark:text-slate-200">
                <td className="p-4 font-medium">{TYPE_LABEL[t.type] || t.type}</td>
                <td className="p-4 text-slate-500 dark:text-slate-400">{t.detail}</td>
                <td className="p-4 text-slate-500 dark:text-slate-400">{t.provider || "—"}</td>
                <td className="p-4 text-right tabular-nums">{money(t.amount, t.currency)}</td>
                <td className="p-4">{t.status}</td>
                <td className="p-4 text-slate-500 dark:text-slate-400">{t.date ? new Date(t.date).toLocaleString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAdminToken } from "../../features/auth/adminAuth/adminAuthSlice";
import {
  getCardpulseTrades, approveTrade, rejectTrade,
  getCardpulseSales, approveSale, rejectSale,
  getCardpulseWithdrawals, approveWithdrawal, rejectWithdrawal,
} from "../api/adminApi";

const fmt = (v) => `₦${Number(v || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

const TABS = [
  {
    key: "trades", label: "Trades",
    load: getCardpulseTrades, approve: approveTrade, reject: rejectTrade,
    columns: (r) => [`@${r.user_tag}`, r.product || `${r.face_value} ${r.currency}`, fmt(r.payout_ngn)],
    head: ["User", "Card", "Payout"],
  },
  {
    key: "sales", label: "Sales",
    load: getCardpulseSales, approve: approveSale, reject: rejectSale,
    columns: (r) => [`@${r.user_tag}`, `${r.brand} (${r.country})`, `${r.face_value} ${r.currency}`],
    head: ["User", "Card", "Stated value"],
  },
  {
    key: "withdrawals", label: "Withdrawals",
    load: getCardpulseWithdrawals, approve: approveWithdrawal, reject: rejectWithdrawal,
    columns: (r) => [`@${r.user_tag}`, `${r.bank_code} · ${r.account_number}`, fmt(r.amount)],
    head: ["User", "Destination", "Amount"],
  },
];

export default function AdminCardpulse() {
  const token = useSelector(selectAdminToken);
  const [active, setActive] = useState(TABS[0]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async (tab) => {
    setLoading(true); setError("");
    try {
      setRows(await tab.load(token));
    } catch (e) {
      setError(e.message);
    } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { if (token) load(active); }, [active, token, load]);

  const act = async (fn, id) => {
    setBusyId(id);
    try { await fn(token, id); await load(active); }
    catch (e) { setError(e.message); }
    finally { setBusyId(null); }
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">CardPulse</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-6">Review queues — approve or reject pending items</p>

      <div className="flex gap-2 mb-5">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setActive(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              active.key === t.key
                ? "bg-brand-600 text-white shadow"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {error && <p className="text-rose-600 mb-4">{error}</p>}

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-6 text-slate-500 dark:text-slate-400">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="p-6 text-slate-500 dark:text-slate-400">Nothing pending in {active.label.toLowerCase()}. 🎉</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  {active.head.map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}
                  <th className="px-4 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-slate-100 dark:border-slate-800/60">
                    {active.columns(r).map((c, i) => (
                      <td key={i} className="px-4 py-3 text-slate-800 dark:text-slate-200">{c}</td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => act(active.approve, r.id)} disabled={busyId === r.id}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50">
                          Approve
                        </button>
                        <button onClick={() => act((tk, id) => active.reject(tk, id, "Rejected by admin"), r.id)} disabled={busyId === r.id}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50">
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

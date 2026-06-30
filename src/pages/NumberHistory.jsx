import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Loader2, Hourglass, MessageSquare, X, CheckCheck, AlertCircle, CheckCircle2,
} from "lucide-react";
import { selectCurrentUser, selectAuthToken } from "../features/auth/authSlice";

const SYMBOLS = { NGN: "₦", GHS: "₵", KES: "KSh", ZAR: "R", XOF: "CFA", XAF: "FCFA", UGX: "USh", USD: "$" };

export default function NumberHistory() {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectAuthToken);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(null);
  const [sms, setSms] = useState(null); // item shown in the SMS modal

  const backendUrl = import.meta.env.VITE_BACKEND_BASE;
  const cur = user?.wallet?.currency || "NGN";
  const sym = SYMBOLS[cur] || `${cur} `;

  const load = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/virtualnumbers/history/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load history");
      setHistory(await res.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const statusOf = (it) => {
    if (it.status === "Cancelled") return "Cancelled";
    if (it.charged || it.sms_received_at || it.messages?.length) return "Completed";
    if (it.status === "Pending") return "Pending";
    return it.status || "Pending";
  };

  const pending = history.filter((h) => statusOf(h) === "Pending").length;
  const completed = history.filter((h) => statusOf(h) === "Completed").length;

  const money = (v) => `${sym}${Number(v || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const fmtExpires = (d) => {
    const e = new Date(new Date(d).getTime() + 60 * 60 * 1000);
    return `${e.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} - ${e.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
  };

  const handleCancel = async (it) => {
    setCancelling(it.id);
    try {
      const res = await fetch(`${backendUrl}/api/virtualnumbers/cancel/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ activation_id: it.activation_id }),
      });
      if (res.ok || res.status === 404) {
        setHistory((prev) => prev.map((h) => (h.id === it.id ? { ...h, status: "Cancelled" } : h)));
      }
    } catch { /* noop */ } finally {
      setCancelling(null);
    }
  };

  const PILL = {
    Pending: { cls: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400", Icon: AlertCircle, ic: "text-amber-500" },
    Cancelled: { cls: "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400", Icon: AlertCircle, ic: "text-rose-500" },
    Completed: { cls: "bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400", Icon: CheckCheck, ic: "text-sky-500" },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container-app py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Rental History</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 mb-6">View your past and current number rentals</p>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-7">
          <div className="rounded-2xl bg-white dark:bg-slate-900 border-l-4 border-emerald-400 border border-slate-200 dark:border-slate-800 shadow-sm p-5 flex items-center justify-between">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Pending Rentals</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{pending}</p>
            </div>
            <span className="grid place-items-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
              <CheckCircle2 size={22} />
            </span>
          </div>
          <div className="rounded-2xl bg-white dark:bg-slate-900 border-l-4 border-violet-400 border border-slate-200 dark:border-slate-800 shadow-sm p-5 flex items-center justify-between">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Completed</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{completed}</p>
            </div>
            <span className="grid place-items-center w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-600">
              <CheckCheck size={22} />
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-500 w-8 h-8" /></div>
        ) : error ? (
          <p className="text-rose-600">{error}</p>
        ) : history.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-10 text-center text-slate-500 dark:text-slate-400">
            No rentals yet. Purchased numbers will appear here.
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
            <table className="w-full text-sm whitespace-nowrap">
              <thead className="bg-slate-800 text-white">
                <tr className="text-left">
                  {["ID", "Phone Number", "Service", "Country", "Price", "Code", "Status", "Date", "Expires", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 font-semibold uppercase text-xs tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {history.map((it) => {
                  const st = statusOf(it);
                  const pill = PILL[st] || PILL.Pending;
                  return (
                    <tr key={it.id} className="text-slate-800 dark:text-slate-200">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900 dark:text-white">{user?.username || user?.full_name}</p>
                        <p className="text-xs text-slate-400">#{it.activation_id}</p>
                      </td>
                      <td className="px-4 py-3 font-mono">{it.phone_number}</td>
                      <td className="px-4 py-3">
                        <p>{it.service}</p>
                        <p className="text-xs text-amber-500">Short-Term</p>
                      </td>
                      <td className="px-4 py-3">
                        <p>{it.country}</p>
                        <p className="text-xs text-amber-500">Short-Term</p>
                      </td>
                      <td className="px-4 py-3 font-semibold tabular-nums">{money(it.cost)}</td>
                      <td className="px-4 py-3">
                        {st === "Completed" ? (
                          <button onClick={() => setSms(it)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white px-3 py-1.5 text-xs font-semibold">
                            <MessageSquare size={14} /> View SMS
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 px-3 py-1.5 text-xs font-medium">
                            <Hourglass size={13} /> Waiting...
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${pill.cls}`}>
                          <pill.Icon size={13} className={pill.ic} /> {st}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{fmtDate(it.created_at)}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{fmtExpires(it.created_at)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleCancel(it)}
                            disabled={st !== "Pending" || cancelling === it.id}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold border ${
                              st === "Pending"
                                ? "border-rose-300 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                : "border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600 cursor-not-allowed"
                            }`}
                          >
                            {cancelling === it.id ? "..." : "Cancel"}
                          </button>
                          <div className="flex items-center gap-1.5 opacity-50">
                            <span className="text-xs text-slate-400">Auto-Renew:</span>
                            <span className="w-9 h-5 rounded-full bg-slate-200 dark:bg-slate-700 relative">
                              <span className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow" />
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SMS modal */}
      {sms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSms(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white">SMS for {sms.phone_number}</h3>
              <button onClick={() => setSms(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X size={20} /></button>
            </div>
            {sms.messages?.length ? (
              <div className="space-y-2">
                {sms.messages.map((m) => (
                  <div key={m.id} className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 px-3 py-2">
                    <p className="font-mono text-sm text-emerald-800 dark:text-emerald-300 break-all">{m.text}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{new Date(m.received_at).toLocaleString("en-GB")}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 dark:text-slate-400 text-sm">The code was received for this number.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import {
  RefreshCw, Loader2, Clock, Copy, MessageSquare, Inbox,
  ShieldAlert, Phone, RotateCw, Send, X,
} from "lucide-react";

const BASE = import.meta.env.VITE_BACKEND_BASE;
const SYMBOLS = { NGN: "₦", GHS: "₵", KES: "KSh", ZAR: "R", XOF: "CFA", XAF: "FCFA", UGX: "USh", USD: "$" };

const money = (v, cur) => `${SYMBOLS[cur] || `${cur} `}${Number(v || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

const timeLeft = (endsAt) => {
  if (!endsAt) return "—";
  const ms = new Date(endsAt).getTime() - Date.now();
  if (ms <= 0) return "Expired";
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  if (d > 0) return `${d}d ${h}h left`;
  const m = Math.floor((ms % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m left` : `${m}m left`;
};

const fmtNumber = (n) => {
  const s = String(n || "").replace(/\D/g, "");
  if (s.length === 10) return `(${s.slice(0, 3)}) ${s.slice(3, 6)}-${s.slice(6)}`;
  if (s.length === 11) return `+${s[0]} (${s.slice(1, 4)}) ${s.slice(4, 7)}-${s.slice(7)}`;
  return n;
};

export default function RentNumber() {
  const token = localStorage.getItem("access_token");
  const authHeaders = { Authorization: `Bearer ${token}` };

  const [plans, setPlans] = useState([]);
  const [currency, setCurrency] = useState("NGN");
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [renting, setRenting] = useState("");        // duration key being rented
  const [smsFor, setSmsFor] = useState(null);        // rental id whose SMS panel is open
  const [smsData, setSmsData] = useState({});        // { [id]: { loading, messages } }
  const [reactivating, setReactivating] = useState(0);
  const [sendModal, setSendModal] = useState(null);  // { rental }
  const [sendTo, setSendTo] = useState("");
  const [sendContent, setSendContent] = useState("");
  const [sending, setSending] = useState(false);

  const loadPricing = useCallback(async () => {
    try {
      const res = await fetch(`${BASE}/api/rentals/pricing/`, { headers: authHeaders });
      const data = await res.json();
      if (res.ok) { setPlans(data.plans || []); setCurrency(data.currency || "NGN"); }
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const loadMine = useCallback(async () => {
    try {
      const res = await fetch(`${BASE}/api/rentals/mine/`, { headers: authHeaders });
      const data = await res.json();
      if (res.ok) setRentals(Array.isArray(data) ? data : []);
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    (async () => { setLoading(true); await Promise.all([loadPricing(), loadMine()]); setLoading(false); })();
  }, [loadPricing, loadMine]);

  const rent = async (duration) => {
    setRenting(duration);
    try {
      const res = await fetch(`${BASE}/api/rentals/rent/`, {
        method: "POST",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ duration }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Could not rent a number");
      toast.success(`Rented ${fmtNumber(data.number)} — it's yours for ${data.duration_label}.`);
      await loadMine();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setRenting("");
    }
  };

  const fetchSms = async (id) => {
    setSmsData((s) => ({ ...s, [id]: { loading: true, messages: s[id]?.messages || [] } }));
    try {
      const res = await fetch(`${BASE}/api/rentals/${id}/sms/`, { headers: authHeaders });
      const data = await res.json();
      setSmsData((s) => ({ ...s, [id]: { loading: false, messages: res.ok ? (data.messages || []) : [] } }));
    } catch {
      setSmsData((s) => ({ ...s, [id]: { loading: false, messages: [] } }));
    }
  };

  const openSms = (id) => {
    if (smsFor === id) { setSmsFor(null); return; }
    setSmsFor(id);
    fetchSms(id);
  };

  const reactivate = async (rental) => {
    setReactivating(rental.id);
    try {
      // Show cost first
      const costRes = await fetch(`${BASE}/api/rentals/${rental.id}/reactivate/`, { headers: authHeaders });
      const cost = await costRes.json();
      if (!costRes.ok) throw new Error(cost?.error || "Reactivation isn't available for this number.");
      if (!window.confirm(`Reactivate ${fmtNumber(rental.number)} for ${money(cost.price, cost.currency)}?`)) {
        setReactivating(0); return;
      }
      const res = await fetch(`${BASE}/api/rentals/${rental.id}/reactivate/`, { method: "POST", headers: authHeaders });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Reactivation failed");
      toast.success("Number reactivated.");
      await loadMine();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setReactivating(0);
    }
  };

  const copy = (n) => { navigator.clipboard?.writeText(n); toast.info("Number copied"); };

  const openSend = (rental) => { setSendModal({ rental }); setSendTo(""); setSendContent(""); };

  const sendSms = async () => {
    if (!sendTo.trim() || !sendContent.trim()) { toast.error("Enter a recipient number and a message."); return; }
    setSending(true);
    try {
      const res = await fetch(`${BASE}/api/rentals/${sendModal.rental.id}/send-sms/`, {
        method: "POST",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ to: sendTo.trim(), content: sendContent.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Could not send the SMS");
      toast.success("SMS sent.");
      setSendModal(null);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-1">
          <span className="grid place-items-center w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-lg">
            <Phone size={22} />
          </span>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Rent a US Number</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Keep a US number for days — receive SMS from many apps. Reactivate after it expires.
            </p>
          </div>
        </div>

        {/* Non-refundable notice */}
        <div className="mt-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-sm">
          <ShieldAlert size={18} className="shrink-0 mt-0.5" />
          <p>
            A rental reserves the number for the full period, so it's <strong>non-refundable</strong> once purchased.
            You're only charged after the number is successfully provisioned.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-500">
            <Loader2 className="animate-spin mr-2" size={20} /> Loading…
          </div>
        ) : (
          <>
            {/* Plans */}
            <h2 className="mt-8 mb-3 text-lg font-bold text-slate-900 dark:text-white">Choose a rental length</h2>
            {plans.length === 0 ? (
              <p className="text-slate-400 text-sm">Rentals are temporarily unavailable. Please try again shortly.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {plans.map((p) => (
                  <div key={p.duration} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5">
                    <p className="text-sm text-slate-500 dark:text-slate-400">US number</p>
                    <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">{p.label}</p>
                    <p className="mt-1 text-lg font-bold text-indigo-600 dark:text-indigo-400">{money(p.price, currency)}</p>
                    <button
                      onClick={() => rent(p.duration)}
                      disabled={!!renting}
                      className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 text-sm disabled:opacity-50"
                    >
                      {renting === p.duration ? <Loader2 size={16} className="animate-spin" /> : <Phone size={16} />}
                      {renting === p.duration ? "Renting…" : "Rent this number"}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* My rentals */}
            <div className="mt-10 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">My rentals</h2>
              <button onClick={loadMine} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                <RefreshCw size={14} /> Refresh
              </button>
            </div>

            {rentals.length === 0 ? (
              <div className="mt-4 text-center py-12 text-slate-400 text-sm">
                <Inbox size={28} className="mx-auto mb-2 opacity-60" /> No rentals yet.
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {rentals.map((r) => {
                  const expired = r.is_expired || r.status === "expired";
                  const sms = smsData[r.id];
                  return (
                    <div key={r.id} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-lg font-bold text-slate-900 dark:text-white">{fmtNumber(r.number) || "assigning…"}</p>
                            {r.number && (
                              <button onClick={() => copy(r.number)} className="text-slate-400 hover:text-slate-600" title="Copy">
                                <Copy size={14} />
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <Clock size={12} /> {expired ? "Expired" : timeLeft(r.ends_at)} · {r.duration_label} · {money(r.amount_charged, r.charged_currency)}
                          </p>
                        </div>
                        <span className={`text-[11px] font-bold uppercase px-2 py-1 rounded-full ${
                          r.status === "cancelled" ? "bg-slate-100 dark:bg-slate-800 text-slate-500"
                            : expired ? "bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400"
                            : "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400"}`}>
                          {r.status === "cancelled" ? "Cancelled" : expired ? "Expired" : "Active"}
                        </span>
                        <div className="flex items-center gap-2">
                          {r.number && r.status !== "cancelled" && (
                            <button onClick={() => openSms(r.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                              <MessageSquare size={14} /> Inbox
                            </button>
                          )}
                          {r.number && !expired && r.status !== "cancelled" && (
                            <button onClick={() => openSend(r)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                              <Send size={14} /> Send
                            </button>
                          )}
                          {expired && r.status !== "cancelled" && (
                            <button onClick={() => reactivate(r)} disabled={reactivating === r.id} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 text-sm font-semibold disabled:opacity-50">
                              {reactivating === r.id ? <Loader2 size={14} className="animate-spin" /> : <RotateCw size={14} />} Reactivate
                            </button>
                          )}
                        </div>
                      </div>

                      {/* SMS panel */}
                      {smsFor === r.id && (
                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                          {sms?.loading ? (
                            <p className="text-sm text-slate-400 flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Checking for messages…</p>
                          ) : sms?.messages?.length ? (
                            <div className="space-y-2">
                              {sms.messages.map((m, i) => (
                                <div key={i} className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-500">{m.from || "Unknown"}</span>
                                    {m.code && <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{m.code}</span>}
                                  </div>
                                  <p className="text-sm text-slate-800 dark:text-slate-200 mt-1 break-words">{m.text}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-slate-400">No messages yet. Texts from people and OTP codes from apps appear here as they arrive.</p>
                              <button onClick={() => fetchSms(r.id)} className="text-xs text-indigo-500 hover:underline">Refresh</button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Send SMS modal */}
      {sendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => !sending && setSendModal(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-slate-900 dark:text-white">Send SMS</h3>
              <button onClick={() => !sending && setSendModal(null)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">From {fmtNumber(sendModal.rental.number)}</p>

            <label className="text-xs font-semibold text-slate-500">Send to (number)</label>
            <input
              value={sendTo}
              onChange={(e) => setSendTo(e.target.value)}
              placeholder="e.g. 12025550143"
              className="w-full mt-1 mb-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
            />

            <label className="text-xs font-semibold text-slate-500">Message</label>
            <textarea
              rows={3}
              maxLength={160}
              value={sendContent}
              onChange={(e) => setSendContent(e.target.value)}
              placeholder="Your message…"
              className="w-full mt-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 resize-none"
            />
            <p className="text-right text-[11px] text-slate-400 mt-1">{sendContent.length}/160</p>

            <button
              onClick={sendSms}
              disabled={sending}
              className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 text-sm disabled:opacity-50"
            >
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {sending ? "Sending…" : "Send SMS"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

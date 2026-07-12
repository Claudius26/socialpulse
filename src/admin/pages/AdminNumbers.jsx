import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAdminToken } from "../../features/auth/adminAuth/adminAuthSlice";
import { getAdminNumbers, getAdminNumberSms } from "../api/adminApi";
import { Check, MessageSquare, X, Loader2 } from "lucide-react";

const STATUS_TINT = {
  Active: "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400",
  Pending: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400",
  Cancelled: "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400",
  Failed: "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400",
  Expired: "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
};

// Friendly names for the upstream API that fulfilled the number.
const PROVIDER_LABEL = { zapotp: "ZapOTP", "5sim": "5SIM", "sms-man": "SMS-Man", smsbower: "SMSBower" };
const providerName = (p) => PROVIDER_LABEL[p] || p || "—";

function Detail({ label, value, sub, strong, mono, cap }) {
  return (
    <div className="min-w-0">
      <p className="text-slate-400">{label}</p>
      <p className={`text-slate-700 dark:text-slate-200 break-words ${strong ? "font-semibold" : ""} ${mono ? "font-mono" : ""} ${cap ? "capitalize" : ""}`}>
        {value}
      </p>
      {sub && <p className="text-slate-400 text-[11px] break-all">{sub}</p>}
    </div>
  );
}

function StatusPill({ status }) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_TINT[status] || "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}>
      {status}
    </span>
  );
}

const selectCls =
  "rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm";

function AdminNumbers() {
  const token = useSelector(selectAdminToken);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusF, setStatusF] = useState("");
  const [sourceF, setSourceF] = useState("");
  const [sms, setSms] = useState(null);        // { phone_number, messages, ... }
  const [smsLoading, setSmsLoading] = useState(false);

  const openSms = async (numberId) => {
    setSmsLoading(true);
    setSms({ loading: true });
    try {
      setSms(await getAdminNumberSms(token, numberId));
    } catch (e) {
      setSms({ error: e.message || "Failed to load SMS" });
    } finally {
      setSmsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const params = [];
        if (statusF) params.push(`status=${statusF}`);
        if (sourceF) params.push(`source=${sourceF}`);
        const q = params.length ? `?${params.join("&")}` : "";
        setRows(await getAdminNumbers(token, q));
      } catch (e) {
        setError(e.message || "Failed to load numbers");
      } finally {
        setLoading(false);
      }
    })();
  }, [token, statusF, sourceF]);

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">Numbers</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-6">Every virtual number purchased across all users</p>

      <div className="flex flex-wrap gap-3 mb-5">
        <select value={statusF} onChange={(e) => setStatusF(e.target.value)} className={selectCls}>
          <option value="">All statuses</option>
          <option>Pending</option><option>Active</option><option>Cancelled</option>
          <option>Expired</option><option>Failed</option>
        </select>
        <select value={sourceF} onChange={(e) => setSourceF(e.target.value)} className={selectCls}>
          <option value="">All methods</option>
          <option value="api">API</option>
          <option value="wallet">Normal</option>
        </select>
      </div>

      {loading ? (
        <p className="text-slate-600 dark:text-slate-300">Loading…</p>
      ) : error ? (
        <p className="text-rose-600">{error}</p>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
          <table className="w-full text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Number</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Country</th>
                <th className="px-4 py-3 font-medium">Provider / API</th>
                <th className="px-4 py-3 font-medium">Method</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">SMS</th>
                <th className="px-4 py-3 font-medium">Cost</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {rows.length === 0 && (
                <tr><td colSpan={10} className="px-4 py-6 text-center text-slate-400">No numbers found.</td></tr>
              )}
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-800 dark:text-slate-200">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800 dark:text-white">{r.user_name || "—"}</p>
                    <p className="text-xs text-slate-400">{r.user_email}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-700 dark:text-slate-300">{r.phone_number}</td>
                  <td className="px-4 py-3 capitalize">{r.service}</td>
                  <td className="px-4 py-3">{r.country}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400">
                      {providerName(r.provider)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.method === "API" ? "bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-400" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}>
                      {r.method}
                    </span>
                  </td>
                  <td className="px-4 py-3"><StatusPill status={r.status} /></td>
                  <td className="px-4 py-3">
                    <button onClick={() => openSms(r.id)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${r.sms_received
                        ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"}`}>
                      <MessageSquare size={13} /> {r.sms_received ? "View" : "Details"}
                    </button>
                  </td>
                  <td className="px-4 py-3 tabular-nums">{Number(r.cost).toFixed(2)}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{r.created_at ? new Date(r.created_at).toLocaleString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {sms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSms(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white font-mono">
                {sms.phone_number || "Number"}
              </h3>
              <button onClick={() => setSms(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X size={20} /></button>
            </div>
            {smsLoading || sms.loading ? (
              <div className="flex justify-center py-8"><Loader2 className="animate-spin text-brand-500 w-6 h-6" /></div>
            ) : sms.error ? (
              <p className="text-rose-600 text-sm">{sms.error}</p>
            ) : (
              <>
                {/* Everything tied to this number */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <Detail label="User" value={sms.user_name || sms.user_email} sub={sms.user_name ? sms.user_email : ""} />
                  <Detail label="Provider / API" value={providerName(sms.provider)} strong />
                  <Detail label="Service" value={sms.service} cap />
                  <Detail label="Country" value={sms.country} />
                  <Detail label="Provider order ID" value={sms.activation_id || "—"} mono />
                  <Detail label="Status" value={`${sms.status || "—"} · ${sms.method || "—"}`} />
                  <Detail label="Cost" value={sms.cost != null ? Number(sms.cost).toFixed(2) : "—"} />
                  <Detail label="Purchased" value={sms.created_at ? new Date(sms.created_at).toLocaleString() : "—"} />
                </div>

                <p className="text-xs font-semibold text-slate-500 mb-2">Messages received</p>
                {sms.messages?.length ? (
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {sms.messages.map((m) => (
                      <div key={m.id} className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 px-3 py-2">
                        <p className="font-mono text-sm text-emerald-800 dark:text-emerald-300 break-all">{m.text}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{m.received_at ? new Date(m.received_at).toLocaleString() : ""}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 text-sm">No SMS messages recorded for this number.</p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminNumbers;

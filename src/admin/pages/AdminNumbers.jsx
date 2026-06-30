import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAdminToken } from "../../features/auth/adminAuth/adminAuthSlice";
import { getAdminNumbers } from "../api/adminApi";
import { Check } from "lucide-react";

const STATUS_TINT = {
  Active: "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400",
  Pending: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400",
  Cancelled: "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400",
  Failed: "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400",
  Expired: "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
};

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
                <th className="px-4 py-3 font-medium">Method</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">SMS</th>
                <th className="px-4 py-3 font-medium">Cost</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {rows.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-6 text-center text-slate-400">No numbers found.</td></tr>
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
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.method === "API" ? "bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-400" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}>
                      {r.method}
                    </span>
                  </td>
                  <td className="px-4 py-3"><StatusPill status={r.status} /></td>
                  <td className="px-4 py-3">
                    {r.sms_received ? <Check size={16} className="text-emerald-600 dark:text-emerald-400" /> : <span className="text-slate-300 dark:text-slate-600">—</span>}
                  </td>
                  <td className="px-4 py-3 tabular-nums">{Number(r.cost).toFixed(2)}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{r.created_at ? new Date(r.created_at).toLocaleString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminNumbers;

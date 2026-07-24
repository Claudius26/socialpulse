import { useState } from "react";
import { useNavigate } from "react-router";
import useAdminData from "../../admin/useAdminData";

const money = (v, c = "NGN") =>
  `${c === "NGN" ? "₦" : c + " "}${Number(v || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

export default function PanelUsers() {
  const navigate = useNavigate();
  const { data, loading, error } = useAdminData("panelUsers", { pollMs: 30000 });
  const users = data || [];
  const [q, setQ] = useState("");

  if (loading) return <p className="text-slate-500 dark:text-slate-300">Loading your users…</p>;

  const filtered = users.filter((u) =>
    [u.username, u.email, u.full_name].join(" ").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      {error && <p className="mb-4 text-sm text-rose-600">{error}</p>}

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">My Users</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {users.length} user{users.length === 1 ? "" : "s"} signed up through your link.
          </p>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search…"
          className="w-full sm:w-64 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0d1c17] text-slate-900 dark:text-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500/40"
        />
      </div>

      <div className="bg-white dark:bg-[#0d1c17] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[860px] text-sm">
          <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400">
            <tr className="text-left">
              <th className="p-4">Status</th>
              <th className="p-4">User</th>
              <th className="p-4">Country</th>
              <th className="p-4 text-right">Balance</th>
              <th className="p-4 text-right">Deposited</th>
              <th className="p-4 text-right">Spent</th>
              <th className="p-4">Joined</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="p-6 text-center text-slate-400">No users yet.</td></tr>
            )}
            {filtered.map((u) => {
              const spent = (u.spent_on_numbers || 0) + (u.spent_on_boost || 0) +
                (u.spent_on_esim || 0) + (u.spent_on_rentals || 0);
              return (
                <tr
                  key={u.id}
                  onClick={() => navigate(`/panel/users/${u.id}`)}
                  className="border-t border-slate-100 dark:border-slate-800/60 text-slate-800 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 cursor-pointer"
                >
                  <td className="p-4">
                    <span className="inline-flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${u.is_online ? "bg-emerald-500" : "bg-slate-400"}`} />
                      {u.is_blocked && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">BLOCKED</span>
                      )}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="font-medium">{u.full_name || u.username}</p>
                    <p className="text-xs text-slate-400">{u.email}</p>
                  </td>
                  <td className="p-4">{u.country || "—"}</td>
                  <td className="p-4 text-right tabular-nums">{money(u.balance, u.currency)}</td>
                  <td className="p-4 text-right tabular-nums">{money(u.deposited, u.currency)}</td>
                  <td className="p-4 text-right tabular-nums font-semibold">{money(spent, u.currency)}</td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">
                    {u.date_joined ? new Date(u.date_joined).toLocaleDateString() : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

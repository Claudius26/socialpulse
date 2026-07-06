import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { selectAdminToken } from "../../features/auth/adminAuth/adminAuthSlice";
import { getAdminUsers } from "../../admin/api/adminApi";

const money = (v, c = "NGN") =>
  `${Number(v || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${c}`;

function StatCard({ label, value, tint }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`text-2xl font-bold mt-1 tabular-nums ${tint || "text-slate-900 dark:text-white"}`}>{value}</p>
    </div>
  );
}

// `app` (optional): "socialpulse" | "cardpulse" — filters the list to one app.
function AdminUsers({ app = null }) {
  const token = useSelector(selectAdminToken);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");

  const fetchUsers = useCallback(async (silent) => {
    try {
      if (!silent) setLoading(true);
      setError("");
      setUsers(await getAdminUsers(token));
    } catch (e) {
      setError(e.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetchUsers();
    const id = setInterval(() => fetchUsers(true), 30000);
    return () => clearInterval(id);
  }, [token, fetchUsers]);

  // Scope to the requested app (if any), then apply the search box.
  const base = app ? users.filter((u) => (u.app || "socialpulse") === app) : users;
  const filtered = base.filter((u) =>
    [u.username, u.email, u.full_name].join(" ").toLowerCase().includes(q.toLowerCase())
  );
  const onlineCount = base.filter((u) => u.is_online).length;
  const tradedCount = base.filter((u) => u.traded).length;
  const spCount = users.filter((u) => (u.app || "socialpulse") === "socialpulse").length;
  const cpCount = users.filter((u) => u.app === "cardpulse").length;

  const title = app === "cardpulse" ? "CardPulse Users"
    : app === "socialpulse" ? "SocialPulse Users" : "All Users";

  if (loading) return <p className="text-slate-600 dark:text-slate-300">Loading users...</p>;
  if (error) return <p className="text-rose-600">{error}</p>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Live status · refreshes every 30s</p>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, email, username…"
          className="w-full sm:w-72 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-brand-500/40"
        />
      </div>

      {app ? (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatCard label={`${title.split(" ")[0]} total`} value={base.length} tint={app === "cardpulse" ? "text-violet-600 dark:text-violet-400" : "text-sky-600 dark:text-sky-400"} />
          <StatCard label="Online now" value={onlineCount} tint="text-emerald-600 dark:text-emerald-400" />
          <StatCard label="Traded" value={tradedCount} tint="text-brand-600 dark:text-brand-400" />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total users" value={users.length} />
          <StatCard label="SocialPulse" value={spCount} tint="text-sky-600 dark:text-sky-400" />
          <StatCard label="CardPulse" value={cpCount} tint="text-violet-600 dark:text-violet-400" />
          <StatCard label="Online now" value={onlineCount} tint="text-emerald-600 dark:text-emerald-400" />
        </div>
      )}

      <p className="text-xs text-slate-400 mb-2">Click a row to open the user's full transactions & funds check.</p>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[1120px] text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400">
            <tr className="text-left">
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Username</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Country</th>
              {!app && <th className="p-4 font-medium">App</th>}
              <th className="p-4 font-medium text-right">Balance</th>
              <th className="p-4 font-medium text-right">Deposited</th>
              <th className="p-4 font-medium text-right">Spent</th>
              <th className="p-4 font-medium">Last seen</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={app ? 8 : 9} className="p-6 text-center text-slate-400">No users found.</td></tr>
            )}
            {filtered.map((user) => {
              const cur = user.currency || "NGN";
              const spent = (user.spent_on_numbers || 0) + (user.spent_on_boost || 0);
              return (
              <tr
                key={user.id}
                onClick={() => navigate(`/admin/users/${user.id}`)}
                className="border-t border-slate-100 dark:border-slate-800/60 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
              >
                <td className="p-4">
                  <span className="inline-flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${user.is_online ? "bg-emerald-500" : "bg-rose-500"}`} />
                    <span className={user.is_online ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}>
                      {user.is_online ? "Online" : "Offline"}
                    </span>
                  </span>
                </td>
                <td className="p-4 font-medium">{user.username}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.country || "-"}</td>
                {!app && (
                  <td className="p-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${user.app === "cardpulse" ? "bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-400" : "bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400"}`}>
                      {user.app === "cardpulse" ? "CardPulse" : "SocialPulse"}
                    </span>
                  </td>
                )}
                <td className="p-4 text-right tabular-nums font-medium whitespace-nowrap">{money(user.balance, cur)}</td>
                <td className="p-4 text-right tabular-nums whitespace-nowrap text-sky-600 dark:text-sky-400">{money(user.deposited, cur)}</td>
                <td className="p-4 text-right tabular-nums whitespace-nowrap">{money(spent, cur)}</td>
                <td className="p-4 text-slate-500 text-xs whitespace-nowrap">
                  {user.last_seen ? new Date(user.last_seen).toLocaleString() : "never"}
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

export default AdminUsers;

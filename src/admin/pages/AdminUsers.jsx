import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAdminToken } from "../../features/auth/adminAuth/adminAuthSlice";
import { getAdminUsers } from "../../admin/api/adminApi";

function AdminUsers() {
  const token = useSelector(selectAdminToken);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        setError("");
        setUsers(await getAdminUsers(token));
      } catch (e) {
        setError(e.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    }
    if (token) fetchUsers();
  }, [token]);

  const filtered = users.filter((u) =>
    [u.username, u.email, u.full_name].join(" ").toLowerCase().includes(q.toLowerCase())
  );

  if (loading) return <p className="text-slate-600 dark:text-slate-300">Loading users...</p>;
  if (error) return <p className="text-rose-600">{error}</p>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Users</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{users.length} total accounts</p>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, email, username…"
          className="w-full sm:w-72 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-brand-500/40"
        />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[860px] text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400">
            <tr className="text-left">
              <th className="p-4 font-medium">ID</th>
              <th className="p-4 font-medium">Username</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Full name</th>
              <th className="p-4 font-medium">Country</th>
              <th className="p-4 font-medium">Active</th>
              <th className="p-4 font-medium">Staff</th>
              <th className="p-4 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-t border-slate-100 dark:border-slate-800/60 text-slate-800 dark:text-slate-200">
                <td className="p-4">{user.id}</td>
                <td className="p-4 font-medium">{user.username}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.full_name || "-"}</td>
                <td className="p-4">{user.country || "-"}</td>
                <td className="p-4">
                  <span className={user.is_active ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"}>
                    {user.is_active ? "Yes" : "No"}
                  </span>
                </td>
                <td className="p-4">{user.is_staff ? "Yes" : "No"}</td>
                <td className="p-4 whitespace-nowrap">{new Date(user.date_joined).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsers;

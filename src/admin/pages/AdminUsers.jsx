import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAdminToken } from "../../features/auth/adminAuth/adminAuthSlice";
import { getAdminUsers } from "../../admin/api/adminApi";

function AdminUsers() {
  const token = useSelector(selectAdminToken);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        setError("");
        const data = await getAdminUsers(token);
        setUsers(data);
      } catch (error) {
        setError(error.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchUsers();
    }
  }, [token]);

  if (loading) {
    return <p className="text-slate-600">Loading users...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Users</h1>

      <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-slate-100">
            <tr className="text-left">
              <th className="p-4">ID</th>
              <th className="p-4">Username</th>
              <th className="p-4">Email</th>
              <th className="p-4">Full Name</th>
              <th className="p-4">Country</th>
              <th className="p-4">Active</th>
              <th className="p-4">Staff</th>
              <th className="p-4">Date Joined</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-4">{user.id}</td>
                <td className="p-4">{user.username}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.full_name || "-"}</td>
                <td className="p-4">{user.country || "-"}</td>
                <td className="p-4">{user.is_active ? "Yes" : "No"}</td>
                <td className="p-4">{user.is_staff ? "Yes" : "No"}</td>
                <td className="p-4">
                  {new Date(user.date_joined).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsers;